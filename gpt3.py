import openai

class GPT3API:
    def __init__(self, token):
        self.token = token
        openai.api_key = token

    def generate_response(self, prompt):
        response = openai.Completion.create(
            engine="code-davinci-002",
            prompt=prompt,
            temperature=0,
            max_tokens=256,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            best_of=1,
            stop="USER:",
            
        )

        return response.choices[0].text

