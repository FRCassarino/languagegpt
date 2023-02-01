import json
import os
from api.prompts import SPANISH_PROMPT, ITALIAN_PROMPT
from flask import Flask, request, jsonify
from api.gpt3 import GPT3API

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
    return "Welcome to LanguageGPT."

conversations = []

@app.route("/chat", methods=["POST"])
def chat():
    selected_language = request.json.get("language")
    message = request.json.get("message")
    if selected_language == "spanish":
        prompt = SPANISH_PROMPT
    elif selected_language == "italian":
        prompt = ITALIAN_PROMPT
    else:
        return jsonify({"error": "Invalid language"}), 400
    if not conversations:
        prompt_with_message = prompt + message + "\nCHATBOT: "
        response = gpt3.generate_response(prompt_with_message)
        conversations.append("USER: " + message + "\nCHATBOT: " + response)
    else:
        prompt_with_conversation = prompt + "\n".join(conversations) + "USER: " + message + "\nCHATBOT: "
        response = gpt3.generate_response(prompt_with_conversation)
        conversations.append("USER: " + message + "\nCHATBOT: " + response)

    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(port=8000, debug=True)
