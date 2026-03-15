# Autonomous Local LLM

Lean multi-agent coding system using local LLMs. One Python file, no bloat.

## Quick Start

```bash
# Install into a new project
cp -r TOOLS/autonomous-local-llm my-project
cd my-project
./autonomous-local-llm init

# Edit GOAL.md with your project description
nano GOAL.md

# Run
./autonomous-local-llm start
```

## How It Works

4 agents take turns in a loop:

```
ContextBuilder → Manager → ContextBuilder → Coder → ContextBuilder → Reviewer → (repeat)
```

| Agent | Job |
|-------|-----|
| **ContextBuilder** | Reads ALL files, summarizes relevant context for next agent |
| **Manager** | Breaks GOAL.md into small tasks |
| **Coder** | Writes code for current task using FILE: markers |
| **Reviewer** | Checks code, marks PASS or FAIL |

## Context Flow

1. **ContextBuilder** reads every file in the project
2. If files are small: summarizes directly
3. If files are large: splits into chunks, summarizes each chunk, combines summaries
4. Passes focused brief to next agent
5. Next agent gets ~4K token brief instead of raw files

## Token Budget (20K context window)

| Phase | Input | Output |
|-------|-------|--------|
| ContextBuilder | 16K (all files) | 4K (brief) |
| Manager/Coder/Reviewer | 4K (brief) | 4K (response) |

## Configuration

Create `config.json`:
```json
{
  "api_url": "http://localhost:1234/v1/chat/completions",
  "api_key": "not-needed",
  "model": "local"
}
```

Or use environment variables:
- `LOCAL_LLM_URL`
- `LOCAL_LLM_KEY`
- `LOCAL_LLM_MODEL`

## Commands

| Command | Description |
|---------|-------------|
| `init` | Create GOAL.md template |
| `start` | Run agent loop |
| `once` | Run one iteration |
| `logs` | Show live logs |

## File Structure

| File | Purpose |
|------|---------|
| `multi_agent.py` | All 4 agents + loop (~700 lines) |
| `autonomous-local-llm` | Entry script |
| `GOAL.md` | Your project description (you create) |
| `.tasks.json` | Task list (auto-generated) |
| `.agent-state.json` | State (auto-generated) |
| `.autonomous.log` | Logs (auto-rotated at 1MB) |

## Coder Output Format

The Coder writes files using markers:

```
FILE: src/main.py
```python
def main():
    print("Hello")
```
```

Multiple files in one response:

```
FILE: src/utils.py
```python
def helper():
    pass
```

FILE: src/main.py
```python
from utils import helper

def main():
    helper()
```
```

## Error Handling

- Files >1MB are skipped with warning
- LLM calls retry 3x with 10min timeout
- If ContextBuilder fails, uses minimal fallback context
- If Coder fails, task gets retry counter
- If Reviewer fails, task marked for retry
- Task skipped after 3 failed attempts

## Git Integration

- Commits every 5 iterations
- Commits on task completion
- Only commits if files changed

## Limitations

- 20K context window (local LLM constraint)
- No GitHub integration (local files only)
- No browser automation
- No test execution
