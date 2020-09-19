from flask import Flask, jsonify, make_response,request
from flask_cors import CORS
import json
from flask_socketio import SocketIO, send, emit
import numpy as np
from time import sleep
from threading import Thread, Event

# # from config_reader import config_reading
#
app = Flask(__name__)
count=0
CORS(app, origins="*", methods=['GET', 'POST'], allow_headers=[
        "Content-Type", "Authorization", "Access-Control-Allow-Credentials","Access-Control-Allow-Origin","Access-Control-Allow-Headers"],
        supports_credentials=True)

socketio = SocketIO(app, cors_allowed_origins="*")

with open('config_ticker.txt') as f:
    json_data = json.load(f)
    elements_per_update = int(json_data['elements_per_update'])
    tickers = np.array(json_data['symbols'])
    update_frequency_milliseconds = int(json_data['update_frequency_milliseconds'])


thread = Thread()
thread_stop_event = Event()



def generate_data():

    while not thread_stop_event.isSet():
        data = []
        random_tickers = np.random.choice(tickers, elements_per_update)

        random_price = np.random.randint(1, 50000, elements_per_update).tolist()
        for i in range(elements_per_update):
            data.append({"symbol": random_tickers[i], "price": random_price[i]})
        socketio.emit('receive_data', data)
        global count
        print('sent=', count)
        count += 1
        socketio.sleep(update_frequency_milliseconds*0.001)
        # socketio.sleep(10)





@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

@socketio.on('connect')
def test_connect():
    print("connected")
    global thread

    if not thread.is_alive():
        print("Starting Thread")
        thread = socketio.start_background_task(generate_data)


@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')


if __name__ == '__main__':
    socketio.run(app)
