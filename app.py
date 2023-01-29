import json
import os
from flask import Flask, request, jsonify
from gpt3 import GPT3API

app = Flask(__name__)

try:
    with open('config.json', 'r') as config_file:
        local_config = json.load(config_file)
except IOError:
    local_config = None

config = {
    "gpt3_token": os.environ.get('GPT3_TOKEN') or local_config['gpt3_token'],
}

gpt3 = GPT3API(config["gpt3_token"]) 

@app.route("/")
def home():
    prompt = "Write a short story about a cat."
    response = gpt3.generate_response(prompt)
    return response

@app.route("/gpt3", methods=["POST"])
def generate_response():
    prompt = request.json.get("prompt")
    response = gpt3.generate_response(prompt)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run()