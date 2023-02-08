import json
import os
from api.prompts import *
from flask import Flask, request, jsonify
from api.gpt3 import GPT3API
import random
import re
app = Flask(__name__)

try:
    with open('config.json', 'r') as config_file:
        local_config = json.load(config_file)
except IOError:
    local_config = None

config = {
    "gpt3_token": os.environ.get('GPT3_TOKEN') or local_config['gpt3_token'],
}

with open("icebreakers.txt", "r") as file:
    ICEBREAKERS = file.read()

gpt3 = GPT3API(config["gpt3_token"]) 

LANGUAGE_PROMPTS = {
    "spanish": SPANISH_PROMPT,
    "italian": ITALIAN_PROMPT,
    "french": FRENCH_PROMPT,
    "german": GERMAN_PROMPT,
    "portuguese": PORTUGUESE_PROMPT,
    "dutch": DUTCH_PROMPT,
    "swedish": SWEDISH_PROMPT,
    "turkish": TURKISH_PROMPT,
    "russian": RUSSIAN_PROMPT,
    "danish": DANISH_PROMPT,
    "norwegian": NORWEGIAN_PROMPT,
    "polish": POLISH_PROMPT,
    "arabic": ARABIC_PROMPT,
    "greek": GREEK_PROMPT,
    "czech": CZECH_PROMPT,
}

@app.route("/")
def home():
    return "Welcome to LanguageGPT."

conversations = []

def get_random_icebreaker(language):
    language = language.lower()
    with open("icebreakers.txt", "r") as f:
        text = f.read()
        language_group = re.search(f"{language.upper()}.*?(?=\n[A-Z]+:)", text, re.DOTALL)
        if language_group:
            icebreakers = re.findall("-.*?(?=\n)", language_group.group())
            return random.choice(icebreakers).strip().lstrip("- ")
        else:
            return f"Sorry, no icebreakers found for {language}."

@app.route("/chat", methods=["POST"])
def chat():
    selected_language = request.json.get("language")
    message = request.json.get("message")
    prompt = LANGUAGE_PROMPTS.get(selected_language)

    if not prompt:
        return jsonify({"error": "Invalid language"}), 400
    if not conversations:
        conversations.clear()
        prompt_with_message = prompt + message + "\nCHATBOT: "
        response = gpt3.generate_response(prompt_with_message)
        conversations.append("USER: " + message + "\nCHATBOT: " + response)
    else:
        prompt_with_conversation = prompt + "\n".join(conversations) + "\nUSER: " + message + "\nCHATBOT: "
        response = gpt3.generate_response(prompt_with_conversation)
        conversations.append("USER: " + message + "\nCHATBOT: " + response)

    return jsonify({"response": response})

@app.route("/reset", methods=["POST"])
def reset():
    conversations.clear()
    selected_language = request.json.get("language")
    icebreaker = get_random_icebreaker(selected_language)
    prompt = LANGUAGE_PROMPTS.get(selected_language)
    if not prompt:
        return jsonify({"error": "Invalid language"}), 400
    conversations.append("\nCHATBOT: " + icebreaker)
    return jsonify({"response": icebreaker})

# deletes the last message from the user and the chatbot's response
@app.route("/deletelast", methods=["POST"])
def editLastMessage():
    selected_language = request.json.get("language")
    prompt = LANGUAGE_PROMPTS.get(selected_language)

    if not prompt:
        return jsonify({"error": "Invalid language"}), 400
    if not conversations:
        return jsonify({"error": "Nothing to delete"}), 400
    else:
        conversations.pop()

    return jsonify({"response": "Last message deleted"})

if __name__ == "__main__":
    app.run(port=8000, debug=True)
    
