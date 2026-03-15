#!/usr/bin/env python3
"""
Lean Multi-Agent Autonomous Local LLM
~700 lines, bulletproof error handling
"""

import os
import sys
import json
import re
import time
import argparse
import subprocess
from pathlib import Path
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
import urllib.request
import urllib.error
import socket

# Config
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = Path(os.getcwd())
STATE_FILE = PROJECT_DIR / ".agent-state.json"
TASKS_FILE = PROJECT_DIR / ".tasks.json"
LOG_FILE = PROJECT_DIR / ".autonomous.log"
GOAL_FILE = PROJECT_DIR / "GOAL.md"

# Limits
MAX_CONTEXT_TOKENS = 16000
MAX_RESPONSE_TOKENS = 4000
MAX_LOG_SIZE = 1024 * 1024  # 1MB
MAX_STATE_HISTORY = 10
MAX_FILE_SIZE = 1024 * 1024  # 1MB max per file
MAX_TOTAL_CONTEXT_SIZE = 5 * 1024 * 1024  # 5MB total context budget
CHARS_PER_TOKEN = 4
LLM_TIMEOUT = 600  # 10 minutes for local LLM
LLM_MAX_RETRIES = 3
LLM_RETRY_DELAY = 5  # seconds

class AgentRole(Enum):
    MANAGER = "manager"
    CONTEXT_BUILDER = "context_builder"
    CODER = "coder" 
    REVIEWER = "reviewer"

class TaskStatus(Enum):
    TODO = "Todo"
    IN_PROGRESS = "In Progress"
    DONE = "Done"
    SKIPPED = "Skipped"

@dataclass
class Task:
    id: str
    description: str
    status: str
    assignee: Optional[str] = None
    created_at: str = ""
    updated_at: str = ""
    review_feedback: str = ""
    attempt_count: int = 0

# ==================== UTILITIES ====================

def log(level: str, message: str):
    """Write to log with rotation"""
    timestamp = time.strftime('%Y-%m-%dT%H:%M:%S')
    log_line = f"[{timestamp}] [{level.upper()}] {message}\n"
    
    if LOG_FILE.exists() and LOG_FILE.stat().st_size > MAX_LOG_SIZE:
        try:
            lines = LOG_FILE.read_text().split('\n')[-1000:]
            LOG_FILE.write_text('\n'.join(lines))
        except:
            pass
    
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(log_line)
    
    if level in ('error', 'warn'):
        print(log_line.strip(), file=sys.stderr)

def count_tokens(text: str) -> int:
    """Rough token count"""
    return len(text) // CHARS_PER_TOKEN

def truncate_to_tokens(text: str, max_tokens: int) -> str:
    """Truncate text to fit within token budget"""
    max_chars = max_tokens * CHARS_PER_TOKEN
    if len(text) <= max_chars:
        return text
    keep = max_chars // 2
    return text[:keep] + f"\n\n...[truncated {count_tokens(text) - max_tokens} tokens]...\n\n" + text[-keep:]

def call_local_llm(prompt: str, max_tokens: int = MAX_RESPONSE_TOKENS, retries: int = LLM_MAX_RETRIES) -> Tuple[str, bool]:
    """Call local LLM API with retry logic. Returns (response, success)."""
    config = load_config()
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {config.get('api_key', 'not-needed')}"
    }
    
    data = {
        "model": config.get('model', 'local'),
        "messages": [
            {"role": "system", "content": "You are a helpful coding assistant. Be concise and direct."},
            {"role": "user", "content": truncate_to_tokens(prompt, MAX_CONTEXT_TOKENS - 500)}
        ],
        "max_tokens": max_tokens,
        "temperature": 0.7
    }
    
    last_error = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(
                config.get('api_url', 'http://localhost:1234/v1/chat/completions'),
                data=json.dumps(data).encode(),
                headers=headers,
                method='POST'
            )
            
            # Set socket timeout for this request
            old_timeout = socket.getdefaulttimeout()
            socket.setdefaulttimeout(LLM_TIMEOUT)
            
            try:
                with urllib.request.urlopen(req, timeout=LLM_TIMEOUT) as resp:
                    result = json.loads(resp.read().decode())
                    response = result['choices'][0]['message']['content']
                    return response, True
            finally:
                socket.setdefaulttimeout(old_timeout)
                
        except urllib.error.HTTPError as e:
            last_error = f"HTTP {e.code}: {e.reason}"
            log('warn', f'LLM call attempt {attempt + 1}/{retries} failed: {last_error}')
            if attempt < retries - 1:
                time.sleep(LLM_RETRY_DELAY * (attempt + 1))  # Exponential backoff
                
        except urllib.error.URLError as e:
            last_error = f"URL Error: {e.reason}"
            log('warn', f'LLM call attempt {attempt + 1}/{retries} failed: {last_error}')
            if attempt < retries - 1:
                time.sleep(LLM_RETRY_DELAY * (attempt + 1))
                
        except socket.timeout:
            last_error = "Socket timeout"
            log('warn', f'LLM call attempt {attempt + 1}/{retries} timed out after {LLM_TIMEOUT}s')
            if attempt < retries - 1:
                time.sleep(LLM_RETRY_DELAY * (attempt + 1))
                
        except Exception as e:
            last_error = str(e)
            log('warn', f'LLM call attempt {attempt + 1}/{retries} failed: {last_error}')
            if attempt < retries - 1:
                time.sleep(LLM_RETRY_DELAY * (attempt + 1))
    
    log('error', f'LLM call failed after {retries} attempts. Last error: {last_error}')
    return "", False

def load_config() -> Dict:
    """Load config from file or env"""
    config_file = SCRIPT_DIR / ".config.json"
    if config_file.exists():
        return json.loads(config_file.read_text())
    
    return {
        'api_url': os.getenv('LOCAL_LLM_URL', 'http://localhost:1234/v1/chat/completions'),
        'api_key': os.getenv('LOCAL_LLM_KEY', 'not-needed'),
        'model': os.getenv('LOCAL_LLM_MODEL', 'local'),
        'max_tokens': 4000
    }

def load_tasks() -> List[Task]:
    """Load tasks from JSON"""
    if not TASKS_FILE.exists():
        return []
    try:
        data = json.loads(TASKS_FILE.read_text())
        return [Task(**t) for t in data]
    except Exception as e:
        log('error', f'Failed to load tasks: {e}')
        return []

def save_tasks(tasks: List[Task]):
    """Save tasks to JSON"""
    try:
        TASKS_FILE.write_text(json.dumps([asdict(t) for t in tasks], indent=2))
    except Exception as e:
        log('error', f'Failed to save tasks: {e}')

def load_state() -> Dict:
    """Load agent state"""
    if not STATE_FILE.exists():
        return {'iteration': 0, 'history': [], 'context_brief': ''}
    try:
        return json.loads(STATE_FILE.read_text())
    except Exception as e:
        log('error', f'Failed to load state: {e}')
        return {'iteration': 0, 'history': [], 'context_brief': ''}

def save_state(state: Dict):
    """Save agent state with history limit"""
    try:
        if 'history' in state and len(state['history']) > MAX_STATE_HISTORY:
            state['history'] = state['history'][-MAX_STATE_HISTORY:]
        temp = STATE_FILE.with_suffix('.tmp')
        temp.write_text(json.dumps(state, indent=2))
        temp.replace(STATE_FILE)
    except Exception as e:
        log('error', f'Failed to save state: {e}')

def list_files(project_dir: Path) -> List[Path]:
    """List relevant code files"""
    files = []
    for ext in ['.py', '.js', '.ts', '.html', '.css', '.go', '.rs']:
        try:
            files.extend(project_dir.rglob(f'*{ext}'))
        except Exception as e:
            log('warn', f'Error listing files with {ext}: {e}')
    exclude = {'.git', '__pycache__', 'node_modules', 'venv', '.venv', '.cache'}
    return [f for f in files if not any(e in str(f) for e in exclude)]

def read_file_safe(filepath: Path, max_size: int = MAX_FILE_SIZE) -> Tuple[Optional[str], bool]:
    """Read file with size limit. Returns (content, success)."""
    try:
        if not filepath.exists():
            return None, True  # File doesn't exist, not an error
        
        # Check file size
        file_size = filepath.stat().st_size
        if file_size > max_size:
            log('warn', f'File {filepath} too large ({file_size} bytes), skipping')
            return f"[File too large: {file_size} bytes, max {max_size}]", False
        
        content = filepath.read_text(encoding='utf-8', errors='replace')
        return content, True
        
    except PermissionError:
        log('warn', f'Permission denied reading {filepath}')
        return f"[Permission denied: {filepath}]", False
    except Exception as e:
        log('warn', f'Error reading {filepath}: {e}')
        return f"[Error reading file: {e}]", False

def git_commit(message: str, check_changes: bool = True) -> bool:
    """Git commit with optional change check"""
    try:
        if check_changes:
            result = subprocess.run(
                ['git', 'status', '--porcelain'],
                capture_output=True, text=True, cwd=PROJECT_DIR
            )
            if not result.stdout.strip():
                return False
        subprocess.run(['git', 'add', '.'], cwd=PROJECT_DIR, check=True, capture_output=True)
        subprocess.run(['git', 'commit', '-m', message], cwd=PROJECT_DIR, check=True, capture_output=True)
        return True
    except Exception as e:
        log('warn', f'Git commit failed: {e}')
        return False

# ==================== RAW CONTEXT (for ContextBuilder) ====================

def build_raw_context(next_agent: AgentRole, task: Optional[Task] = None) -> str:
    """Build full raw context for ContextBuilder to analyze with size limits."""
    parts = []
    total_size = 0
    files_included = 0
    files_skipped = 0
    
    # Goal
    if GOAL_FILE.exists():
        try:
            goal_content = GOAL_FILE.read_text()
            parts.append("=== PROJECT GOAL ===")
            parts.append(goal_content)
            total_size += len(goal_content)
        except Exception as e:
            log('warn', f'Could not read GOAL.md: {e}')
            parts.append("=== PROJECT GOAL ===")
            parts.append("[Error reading GOAL.md]")
    
    # Current task
    if task:
        task_info = f"\n=== CURRENT TASK ===\nID: {task.id}\nDescription: {task.description}"
        if task.review_feedback:
            task_info += f"\nPrevious feedback: {task.review_feedback}"
        parts.append(task_info)
        total_size += len(task_info)
    
    # Task summary
    try:
        tasks = load_tasks()
        incomplete = [t for t in tasks if t.status in ['Todo', 'In Progress']]
        done = [t for t in tasks if t.status == 'Done']
        summary = f"\n=== TASKS ===\nIncomplete: {len(incomplete)} | Done: {len(done)} | Total: {len(tasks)}"
        
        recent_done = [t for t in tasks if t.status == 'Done'][-5:]
        if recent_done:
            summary += "\nRecently completed:"
            for t in recent_done:
                summary += f"\n  - {t.description[:80]}..."
        
        parts.append(summary)
        total_size += len(summary)
    except Exception as e:
        log('warn', f'Could not load tasks: {e}')
        parts.append("\n=== TASKS ===\n[Error loading tasks]")
    
    # Files with content - with total size budget
    try:
        files = list_files(PROJECT_DIR)
        parts.append(f"\n=== FILES ({len(files)}) ===")
        
        for f in sorted(files):
            # Check if we're over budget
            if total_size >= MAX_TOTAL_CONTEXT_SIZE:
                parts.append(f"\n...[truncated: context size limit reached]...")
                files_skipped += len(files) - files_included
                break
            
            rel = f.relative_to(PROJECT_DIR)
            content, success = read_file_safe(f)
            
            if content is not None:
                file_section = f"\n--- {rel} ---\n{content}"
                
                # Check if adding this would exceed budget
                if total_size + len(file_section) > MAX_TOTAL_CONTEXT_SIZE:
                    parts.append(f"\n...[truncated: remaining {len(files) - files_included} files skipped due to size]...")
                    files_skipped = len(files) - files_included
                    break
                
                parts.append(file_section)
                total_size += len(file_section)
                files_included += 1
            else:
                files_skipped += 1
        
        if files_skipped > 0:
            log('info', f'Context: included {files_included} files, skipped {files_skipped}')
            
    except Exception as e:
        log('error', f'Error building file context: {e}')
        parts.append(f"\n=== FILES ===\n[Error: {e}]")
    
    return '\n'.join(parts)

# ==================== AGENTS ====================

class ContextBuilderAgent:
    """Analyzes full project context and creates focused brief for next agent"""
    
    # Chunk size for hierarchical summarization (leaves room for prompt + response)
    CHUNK_SIZE_TOKENS = 12000  # Process ~12K tokens at a time
    
    def run(self, next_agent: AgentRole, task: Optional[Task] = None) -> Tuple[str, bool]:
        """Build context brief for the next agent. Returns (brief, success)."""
        try:
            raw_context = build_raw_context(next_agent, task)
            
            # Check if we need chunked summarization
            context_tokens = count_tokens(raw_context)
            
            if context_tokens <= MAX_CONTEXT_TOKENS - 2000:
                # Context fits, summarize directly
                return self._summarize_direct(raw_context, next_agent, task)
            else:
                # Context too big, use hierarchical summarization
                log('info', f"Context too large ({context_tokens} tokens), using chunked summarization")
                return self._summarize_chunked(raw_context, next_agent, task)
                
        except Exception as e:
            log('error', f"ContextBuilder exception: {e}")
            return self._fallback_brief(next_agent, task), False
    
    def _summarize_direct(self, context: str, next_agent: AgentRole, task: Optional[Task]) -> Tuple[str, bool]:
        """Summarize context that fits in one prompt."""
        prompt = self._build_prompt(context, next_agent, task)
        brief, success = call_local_llm(prompt, max_tokens=MAX_RESPONSE_TOKENS)
        
        if success:
            log('info', f"ContextBuilder created brief for {next_agent.value} ({count_tokens(brief)} tokens)")
            return brief, True
        else:
            log('error', f"ContextBuilder failed to create brief for {next_agent.value}")
            return self._fallback_brief(next_agent, task), False
    
    def _summarize_chunked(self, context: str, next_agent: AgentRole, task: Optional[Task]) -> Tuple[str, bool]:
        """Hierarchical summarization for large contexts."""
        # Split context into chunks
        chunk_size_chars = self.CHUNK_SIZE_TOKENS * CHARS_PER_TOKEN
        chunks = self._split_into_chunks(context, chunk_size_chars)
        
        log('info', f"Split context into {len(chunks)} chunks for summarization")
        
        # Summarize each chunk
        chunk_summaries = []
        for i, chunk in enumerate(chunks):
            print(f"  📄 Summarizing chunk {i+1}/{len(chunks)}...")
            
            prompt = f"""{chunk}

You are the Context Builder. This is PART {i+1} of {len(chunks)} of the project context.

Create a CONCISE SUMMARY of the key information in this section:
- What files are present and their purpose
- Important code patterns or structures
- Dependencies between components
- Any issues or TODOs mentioned

Be brief but include specific file names and key code details.
"""
            summary, success = call_local_llm(prompt, max_tokens=2000)
            
            if success:
                chunk_summaries.append(f"=== CHUNK {i+1} SUMMARY ===\n{summary}")
            else:
                log('warn', f"Failed to summarize chunk {i+1}, using truncated version")
                chunk_summaries.append(f"=== CHUNK {i+1} SUMMARY ===\n[Summarization failed - using raw chunk]\n{chunk[:2000]}")
        
        # Combine chunk summaries
        combined = '\n\n'.join(chunk_summaries)
        
        # If combined is still too big, do another round of summarization
        if count_tokens(combined) > self.CHUNK_SIZE_TOKENS:
            log('info', "Combined summaries still too large, doing second-level summarization")
            return self._summarize_chunked(combined, next_agent, task)
        
        # Final summarization into agent brief
        print(f"  📝 Creating final brief from {len(chunk_summaries)} chunk summaries...")
        
        prompt = f"""{combined}

You are the Context Builder. Above are summaries of different parts of the project.

Create a FOCUSED BRIEF for the {next_agent.value.upper()} agent who needs to:
"""
        prompt += self._get_agent_needs(next_agent, task)
        prompt += """
The brief should include:
1. Key files the agent needs to know about (with relevant code snippets)
2. Dependencies or related code they should understand
3. Any patterns or conventions used in the codebase
4. Specific guidance for their task

Be CONCISE but COMPLETE. Include actual code snippets, not just filenames.
"""
        
        brief, success = call_local_llm(prompt, max_tokens=MAX_RESPONSE_TOKENS)
        
        if success:
            log('info', f"ContextBuilder created chunked brief for {next_agent.value} ({count_tokens(brief)} tokens)")
            return brief, True
        else:
            log('error', f"ContextBuilder failed final summarization for {next_agent.value}")
            # Return combined summaries as fallback
            return combined[:MAX_CONTEXT_TOKENS * CHARS_PER_TOKEN], False
    
    def _split_into_chunks(self, context: str, chunk_size: int) -> List[str]:
        """Split context into roughly equal chunks at file boundaries."""
        chunks = []
        
        # Split by file sections (--- filename ---)
        file_sections = re.split(r'(\n--- .+? ---\n)', context)
        
        current_chunk = []
        current_size = 0
        
        for section in file_sections:
            section_size = len(section)
            
            if current_size + section_size > chunk_size and current_chunk:
                # Save current chunk and start new one
                chunks.append(''.join(current_chunk))
                current_chunk = [section]
                current_size = section_size
            else:
                current_chunk.append(section)
                current_size += section_size
        
        # Don't forget the last chunk
        if current_chunk:
            chunks.append(''.join(current_chunk))
        
        return chunks if chunks else [context]  # Fallback to whole context
    
    def _build_prompt(self, context: str, next_agent: AgentRole, task: Optional[Task]) -> str:
        """Build the summarization prompt."""
        prompt = f"""{context}

You are the Context Builder. Your job is to analyze the full project context above and create a FOCUSED BRIEF for the {next_agent.value.upper()} agent.

The {next_agent.value.upper()} agent needs to:
"""
        prompt += self._get_agent_needs(next_agent, task)
        prompt += """
Create a BRIEF that includes:
1. Key files the agent needs to know about (with relevant code snippets)
2. Dependencies or related code they should understand
3. Any patterns or conventions used in the codebase
4. Specific guidance for their task

Be CONCISE but COMPLETE. Include actual code snippets, not just filenames.
"""
        return prompt
    
    def _get_agent_needs(self, next_agent: AgentRole, task: Optional[Task]) -> str:
        """Get the needs description for an agent."""
        if next_agent == AgentRole.MANAGER:
            return "- Understand the project goal and current state\n- Create actionable tasks\n"
        elif next_agent == AgentRole.CODER:
            return f"- Implement this task: {task.description if task else 'N/A'}\n- Write code that fits with existing code\n"
        elif next_agent == AgentRole.REVIEWER:
            return f"- Review the work done for: {task.description if task else 'N/A'}\n- Check for bugs and issues\n"
        return ""
    
    def _fallback_brief(self, next_agent: AgentRole, task: Optional[Task]) -> str:
        """Minimal fallback brief when ContextBuilder fails."""
        brief = "=== FALLBACK CONTEXT ===\n"
        brief += f"Next agent: {next_agent.value}\n"
        if task:
            brief += f"Task: {task.description}\n"
        brief += "\n[ContextBuilder failed - using minimal context]\n"
        return brief

class ManagerAgent:
    """Breaks down GOAL into tasks"""
    
    def run(self, context_brief: str) -> Tuple[List[Task], bool]:
        """Create tasks. Returns (tasks, success)."""
        prompt = f"""{context_brief}

You are the Project Manager. Create a list of specific, actionable tasks to achieve the project goal.
Each task should be small enough to complete in one coding session.

Format your response as:
TASK: <task description>
TASK: <task description>

Be specific. Instead of "build the app", use "create main.py with CLI argument parsing".
"""
        
        response, success = call_local_llm(prompt)
        
        if not success:
            log('error', "Manager failed to get LLM response")
            return [], False
        
        # Parse tasks
        tasks = []
        try:
            existing = load_tasks()
            existing_ids = {t.id for t in existing}
            
            for line in response.split('\n'):
                match = re.match(r'TASK:\s*(.+)', line, re.IGNORECASE)
                if match:
                    desc = match.group(1).strip()
                    task_id = f"task_{len(existing) + len(tasks) + 1}"
                    if task_id not in existing_ids:
                        tasks.append(Task(
                            id=task_id,
                            description=desc,
                            status=TaskStatus.TODO.value,
                            assignee=AgentRole.MANAGER.value,
                            created_at=time.strftime('%Y-%m-%dT%H:%M:%S')
                        ))
            
            log('info', f"Manager created {len(tasks)} tasks")
            return tasks, True
            
        except Exception as e:
            log('error', f"Manager failed to parse tasks: {e}")
            return [], False

class CoderAgent:
    """Writes code for tasks"""
    
    def run(self, task: Task, context_brief: str) -> Tuple[str, bool]:
        """Write code. Returns (response, success)."""
        prompt = f"""{context_brief}

=== YOUR TASK ===
{task.description}

You are the Coder. Implement the task above.

Write complete, working code. Use FILE markers:

FILE: path/to/file.py
```python
# code here
```

If modifying existing files, show the full updated file.
Be concise but complete. Handle errors appropriately.
"""
        
        response, success = call_local_llm(prompt, max_tokens=MAX_RESPONSE_TOKENS)
        
        if not success:
            log('error', f"Coder failed for task {task.id}")
            return "", False
        
        # Extract and write files
        try:
            files_written = self._extract_and_write_files(response)
            log('info', f"Coder wrote {files_written} files for task {task.id}")
            return response, True
        except Exception as e:
            log('error', f"Coder failed to write files: {e}")
            return response, False
    
    def _extract_and_write_files(self, response: str) -> int:
        """Extract FILE blocks and write to disk"""
        count = 0
        pattern = r'FILE:\s*(\S+)\s*```(?:\w+)?\n(.*?)```'
        matches = re.findall(pattern, response, re.DOTALL)
        
        for filepath, content in matches:
            try:
                full_path = PROJECT_DIR / filepath
                full_path.parent.mkdir(parents=True, exist_ok=True)
                full_path.write_text(content.rstrip() + '\n')
                count += 1
            except Exception as e:
                log('warn', f'Failed to write file {filepath}: {e}')
        
        return count

class ReviewerAgent:
    """Reviews completed work"""
    
    def run(self, task: Task, context_brief: str) -> Tuple[bool, bool]:
        """Review task. Returns (passed, success)."""
        prompt = f"""{context_brief}

=== TASK TO REVIEW ===
{task.description}

You are the Reviewer. Review the work done for the task above.

Check:
1. Does the code work? (syntax, imports, logic)
2. Does it fulfill the task description?
3. Are there obvious bugs or issues?

Respond with:
PASS - if the work is good
or
FAIL: <reason> - if there are issues

Be strict but fair.
"""
        
        response, success = call_local_llm(prompt, max_tokens=MAX_RESPONSE_TOKENS)
        
        if not success:
            log('error', f"Reviewer failed for task {task.id}")
            # Don't fail the task if reviewer can't respond
            return False, False
        
        try:
            if 'PASS' in response.upper():
                task.status = TaskStatus.DONE.value
                log('info', f"Reviewer PASSED task {task.id}")
                return True, True
            else:
                task.status = TaskStatus.TODO.value
                task.attempt_count += 1
                match = re.search(r'FAIL:\s*(.+)', response, re.IGNORECASE | re.DOTALL)
                task.review_feedback = match.group(1).strip()[:500] if match else "Needs revision"
                log('info', f"Reviewer FAILED task {task.id}: {task.review_feedback[:80]}...")
                return False, True
        except Exception as e:
            log('error', f"Reviewer exception: {e}")
            return False, False

# ==================== MAIN LOOP ====================

def run_iteration():
    """Run one iteration of the agent loop with full error handling."""
    state = load_state()
    state['iteration'] = state.get('iteration', 0) + 1
    iteration = state['iteration']
    
    log('info', f"=== Iteration {iteration} ===")
    print(f"\n🔄 Iteration {iteration}")
    
    tasks = load_tasks()
    
    # MANAGER: Create tasks if none exist
    if not tasks:
        print("📋 Manager: Creating tasks...")
        
        # ContextBuilder → Manager
        context_builder = ContextBuilderAgent()
        brief, cb_success = context_builder.run(AgentRole.MANAGER)
        
        if not cb_success:
            print("  ⚠️ ContextBuilder failed, using fallback")
        
        manager = ManagerAgent()
        new_tasks, mgr_success = manager.run(brief)
        
        if mgr_success and new_tasks:
            tasks.extend(new_tasks)
            save_tasks(tasks)
            print(f"  Created {len(new_tasks)} tasks")
        elif not mgr_success:
            print("  ❌ Manager failed to create tasks, will retry next iteration")
            time.sleep(5)
            return True  # Continue to next iteration
    
    # Find next task
    todo_tasks = [t for t in tasks if t.status == TaskStatus.TODO.value]
    in_progress = [t for t in tasks if t.status == TaskStatus.IN_PROGRESS.value]
    
    if in_progress:
        task = in_progress[0]
    elif todo_tasks:
        task = todo_tasks[0]
        task.status = TaskStatus.IN_PROGRESS.value
        task.assignee = AgentRole.CODER.value
        save_tasks(tasks)
    else:
        print("✅ All tasks complete!")
        return False
    
    print(f"🎯 Task: {task.description[:60]}...")
    
    # CODER: Implement
    print("💻 Coder: Writing code...")
    
    # ContextBuilder → Coder
    context_builder = ContextBuilderAgent()
    brief, cb_success = context_builder.run(AgentRole.CODER, task)
    
    if not cb_success:
        print("  ⚠️ ContextBuilder failed, using fallback")
    
    coder = CoderAgent()
    _, coder_success = coder.run(task, brief)
    
    if not coder_success:
        print("  ❌ Coder failed, will retry next iteration")
        task.attempt_count += 1
        save_tasks(tasks)
        time.sleep(5)
        return True
    
    # REVIEWER: Review
    print("👁️ Reviewer: Reviewing...")
    
    # ContextBuilder → Reviewer
    brief, cb_success = context_builder.run(AgentRole.REVIEWER, task)
    
    if not cb_success:
        print("  ⚠️ ContextBuilder failed, using fallback")
    
    reviewer = ReviewerAgent()
    passed, review_success = reviewer.run(task, brief)
    
    if not review_success:
        print("  ⚠️ Reviewer failed, marking for retry")
        task.attempt_count += 1
        save_tasks(tasks)
    
    # Update task
    task.updated_at = time.strftime('%Y-%m-%dT%H:%M:%S')
    save_tasks(tasks)
    
    if passed:
        print("✅ Task complete")
    else:
        print(f"❌ Task needs revision ({task.attempt_count} attempts)")
        if task.attempt_count >= 3:
            task.status = TaskStatus.SKIPPED.value
            save_tasks(tasks)
            print("⏭️ Task skipped after 3 attempts")
    
    # Git commit every 5 iterations or on task completion
    if iteration % 5 == 0 or passed:
        committed = git_commit(f"Iteration {iteration}: {task.description[:50]}")
        if committed:
            print("📦 Committed changes")
    
    # Save state
    state['history'].append({
        'iteration': iteration,
        'task': task.id,
        'status': task.status,
        'agent': AgentRole.CODER.value
    })
    save_state(state)
    
    return True

def main():
    parser = argparse.ArgumentParser(description='Lean Multi-Agent Local LLM')
    parser.add_argument('--init', action='store_true', help='Create GOAL.md template')
    parser.add_argument('--once', action='store_true', help='Run one iteration and exit')
    parser.add_argument('--max', type=int, default=100, help='Max iterations')
    args = parser.parse_args()
    
    if args.init:
        if GOAL_FILE.exists():
            print("GOAL.md already exists")
            return
        GOAL_FILE.write_text("""# Project Goal

Describe what you want to build here.

## Requirements
- Feature 1
- Feature 2

## Tech Stack
- Language: Python
- Framework: (if any)
""")
        print("Created GOAL.md - edit it with your project goal")
        return
    
    if not GOAL_FILE.exists():
        print("Error: GOAL.md not found. Run with --init to create one.")
        sys.exit(1)
    
    print("🚀 Starting Lean Multi-Agent System")
    print(f"Project: {PROJECT_DIR}")
    print(f"Goal: {GOAL_FILE.read_text().split(chr(10))[0]}")
    print()
    
    iteration = 0
    while iteration < args.max:
        try:
            should_continue = run_iteration()
            if not should_continue:
                break
            iteration += 1
            
            if args.once:
                break
            
            time.sleep(1)
            
        except KeyboardInterrupt:
            print("\n\nStopped by user")
            break
        except Exception as e:
            log('error', f"Iteration failed: {e}")
            print(f"\n❌ Error: {e}")
            time.sleep(5)
    
    print("\n🏁 Done")

if __name__ == "__main__":
    main()
