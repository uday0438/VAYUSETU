from typing import List

class RBACManager:
    """
    Role-Based Access Control configuration.
    """
    def __init__(self):
        self.permissions = {
            "Admin": ["read", "write", "configure_sim", "retrain_models"],
            "Scientist": ["read", "configure_sim"],
            "Analyst": ["read"],
            "Public Viewer": ["read"]
        }
        
    def check_permission(self, role: str, action: str) -> bool:
        return action in self.permissions.get(role, [])
