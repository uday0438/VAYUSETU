from typing import Dict, Optional

class SecurityAuth:
    def verify_token(self, token: str) -> Optional[Dict[str, str]]:
        # Verification logic
        if token == "mock-token-scientist":
            return {"user": "isro_evaluator", "role": "Scientist"}
        return None
