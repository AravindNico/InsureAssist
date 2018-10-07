#!/usr/bin/env python3

import threading
import logging
import time
import paho.mqtt.client as mqtt
import json
import multiprocessing
import random
import datetime

# This is the Publisher

client = mqtt.Client()
client.connect("18.220.57.224", 1883, 60)

vin_number = "vin1234567896"


class Producer(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.stop_event = threading.Event()

    def stop(self):
        self.stop_event.set()

    def run(self):
        while not self.stop_event.is_set():
            now = datetime.datetime.now()
            data = {"VIN": vin_number, "Kilowatt_hr": random.randint(1, 100), "Voltage": random.randint(1, 100), "VehicleType": "car",
                    "SoC": random.randint(1, 100), "Ampere_hr": random.randint(1, 100), "TiuTimeStamp": now.strftime("%Y-%m-%d %H:%M:%S"), "FaultCode": random.randint(1, 100)}
            client.publish("vehicledata", json.dumps(data))
            print("sending")
            time.sleep(1)


def main():
    tasks = [
        Producer()
    ]

    for t in tasks:
        t.start()

    time.sleep(10)

    for task in tasks:
        task.stop()
        client.disconnect()

    for task in tasks:
        task.join()


if __name__ == "__main__":
    logging.basicConfig(
        format='%(asctime)s.%(msecs)s:%(name)s:%(thread)d:%(levelname)s:%(process)d:%(message)s',
        level=logging.INFO
    )
    main()
