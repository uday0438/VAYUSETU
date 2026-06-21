import datetime
import logging

logger = logging.getLogger(__name__)

class AuditLogger:
    def log_action(self, user: str, action: str, details: str):
        timestamp = datetime.datetime.utcnow().isoformat()
        log_msg = f"[AUDIT] {timestamp} | User: {user} | Action: {action} | Details: {details}"
        logger.info(log_msg)
