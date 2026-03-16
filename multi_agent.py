import threading
from typing import Dict, Any

class AgentManager:
    def __init__(self):
        self.agents: Dict[str, Any] = {}  # Initialize dictionary
        self._lock = threading.RLock()  # Use reentrant lock for nested operations
    
    def register_agent(self, agent_id: str, agent: Any):
        with self._lock:
            if agent_id in self.agents:
                raise ValueError(f"Agent {agent_id} already registered")
            self.agents[agent_id] = agent
    
    def send_message(self, sender_id: str, recipient_id: str, message: dict):
        with self._lock:
            if sender_id not in self.agents:
                raise ValueError(f"Sender {sender_id} not registered")
            if recipient_id not in self.agents:
                raise ValueError(f"Recipient {recipient_id} not registered")
            
            # Validate message structure
            if 'type' not in message or 'content' not in message:
                raise ValueError("Message must contain 'type' and 'content'")
            
            # Ensure agent has receive_message method
            if not hasattr(self.agents[recipient_id], 'receive_message'):
                raise AttributeError(f"Agent {recipient_id} missing receive_message method")
            
            self.agents[recipient_id].receive_message(sender_id, message)
