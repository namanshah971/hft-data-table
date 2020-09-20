from flask import Flask, jsonify, make_response
from flask_cors import CORS
import json
from flask_socketio import SocketIO
import numpy as np
from threading import Thread, Event


app = Flask(__name__)
CORS(app, origins="*", methods=['GET', 'POST'], allow_headers=[
        "Content-Type", "Authorization", "Access-Control-Allow-Credentials", "Access-Control-Allow-Origin",
        "Access-Control-Allow-Headers"], supports_credentials=True)

socketio = SocketIO(app, cors_allowed_origins="*")

thread = Thread()
thread_stop_event = Event()

with open('config_ticker.txt') as f:
    json_data = json.load(f)
    elements_per_update = int(json_data['elements_per_update'])
    tickers = np.array(json_data['symbols'])
    update_frequency_milliseconds = int(json_data['update_frequency_milliseconds'])


def generate_data():
    while not thread_stop_event.isSet():
        data = []
        random_tickers = np.random.choice(tickers, elements_per_update)

        random_price = np.random.randint(1, 50000, elements_per_update).tolist()

        for i in range(elements_per_update):
            data.append({"symbol": random_tickers[i], "price": random_price[i]})

        socketio.emit('receive_data', data)
        socketio.sleep(update_frequency_milliseconds*0.001)


@app.errorhandler(404)
def not_found():
    return make_response(jsonify({'error': 'Not found'}), 404)


@socketio.on('connect')
def test_connect():
    print("Client connected")
    global thread

    if not thread.is_alive():
        print("Starting Thread")
        thread_stop_event.clear()
        thread = socketio.start_background_task(generate_data)


@socketio.on('disconnect')
def test_disconnect():
    thread_stop_event.set()
    global update_frequency_milliseconds
    update_frequency_milliseconds = int(json_data['update_frequency_milliseconds'])
    print('Client disconnected')


@socketio.on('change_frequency')
def change_frequency(data):
    global update_frequency_milliseconds

    if data['frequency'] >= 100:
        update_frequency_milliseconds = data['frequency']


if __name__ == '__main__':
    socketio.run(app)
