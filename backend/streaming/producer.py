import time
import random
from app.streaming.event_bus import event_bus

class TelemetryStreamProducer:
    """
    Simulates high-throughput streaming events from INSAT, IMD, and MOSDAC sources.
    """
    def start_streaming(self, district: str):
        print(f"Starting simulated Kafka stream producer for {district}...")
        for i in range(3):
            payload = {
                "source": random.choice(["INSAT-3D", "IMD-GFS", "MOSDAC"]),
                "district": district,
                "temperature": round(29.0 + random.uniform(-1.5, 1.5), 1),
                "rainfall": round(random.uniform(10, 80), 1),
                "timestamp": time.time()
            }
            event_bus.publish("telemetry-topic", payload)
            time.sleep(0.1)