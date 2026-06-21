from app.streaming.event_bus import event_bus

class TelemetryStreamConsumer:
    """
    Consumes live telemetry grids and forwards them to the Kalman Assimilation Engine.
    """
    def __init__(self):
        self.received_packets = []

    def start_listening(self):
        event_bus.subscribe("telemetry-topic", self.on_message_received)

    def on_message_received(self, message: dict):
        print(f"[Stream Consumer] Received packet from {message['source']} for {message['district']}: Rain={message['rainfall']} mm")
        self.received_packets.append(message)