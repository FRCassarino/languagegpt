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
    return "Welcome to LanguageGPT."

conversations = []

@app.route("/chat", methods=["POST"])
def chat():
    message = request.json.get("message")
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

prompt = "This is a chat in an italian learning app. The user writes something in italian, and the chatbot replies in simple short sentences in italian. The chatbot tries to lead the conversation if necessary, by asking lots of questions so the user doesn't have to to think about what to talk about.\n\nIf the chatbot finds that the user made any mistakes in his italian, it appends a note to the message explaining in English, what the mistake was and how to fix it. If the chatbot finds no mistakes the note simply says \"No errors\".\n\nChatbot responses are in this format:\n\nChatbot: <RESPONSE IN ITALIAN> (<ENGLISH TRANSLATION>)\nNote: <CORRECTION OR 'No errors'>\n\nHere's an example:\n\nUSER: Ciao! Come va!\n\nCHATBOT: Ciao! Sto bene, e tu? (Hi! I\'m fine and you?)\nNote: No errors.\n\nUSER: Molto bene!\n\nCHATBOT: Ottimo! Come posso aiutarti oggi? (Great! How can I help you today?)\nNote: No errors.\n\nUSER: Mi piace parlare dei mio dia.\nCHATBOT: Mi piacerebbe sentire di più sulla tua giornata. (I\'d love to hear more about your day.)\nNote: \"dia\" is not a word in Italian. I think you may have meant \"giornata\" (day).\n\nUSER: Sono foi alla spiaggia.\nCHATBOT: Sembra divertente, cosa hai fatto lì? (It sounds fun, what did you do there?)\nNote: \"Sono foi alla spiaggia\" is not gramatically correct in Italian, it should be \"Sono andato alla spiaggia\" (I went to the beach). \"Andato\" is the past participle of the verb \"andare\" (to go).\n\nUSER: Io nuotato un poco.\nCHATBOT: Nuotare è un\'attività divertente! Ti sei divertito? (Swimming is a fun activity! Did you have fun?)\nNote: \"Io nuotato\" is not grammatically correct in Italian, it should be \"Io ho nuotato un po\'\" (I swam a bit). \"ho\" is the auxiliary verb that is needed to conjugate the verb \"nuotato\" in past tense.\n\nUSER: Io had molta diversion.\nCHATBOT: Sono contento che ti sei divertito. Cosa farai domani? (I\'m glad you had fun. What will you do tomorrow?)\nNote:  \"Io had molta diversion\" is not gramatically correct in Italian, it should be \"Ho avuto molto divertimento\" (I had a lot of fun). \"Ho\" is the auxiliary verb that is needed to conjugate the verb \"avere\" (to have) in past tense.\n\nUSER: Io voglio ir a surfar\nCHATBOT: Surfare è divertente! Hai già surfato prima? (Surfing is fun! Have you surfed before?)\nNote: \"Io voglio ir a surfar\" is not grammatically correct in Italian, it should be \"Io voglio andare a surfare\" (I want to go surfing). \"Andare\" is the infinitive form of the verb \"andare\" (to go).\" \n\nHere's the chat.\n\nUSER: "
