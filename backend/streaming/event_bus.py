from typing import Callable, Dict, List

class LocalEventBus:
    """
    In-memory publish-subscribe event bus representing Kafka/Redis messaging.
    """
    def __init__(self):
        self.subscribers: Dict[str, List[Callable]] = {}

    def subscribe(self, topic: str, callback: Callable):
        if topic not in self.subscribers:
            self.subscribers[topic] = []
        self.subscribers[topic].append(callback)

    def publish(self, topic: str, message: dict):
        if topic in self.subscribers:
            for callback in self.subscribers[topic]:
                callback(message)

# Global local event bus
event_bus = LocalEventBus()