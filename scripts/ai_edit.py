import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

with open("js/auth.js", "r", encoding="utf-8") as f:
    original_code = f.read()

prompt = f"""
You are an expert JavaScript developer. Refactor the following authentication module to include a basic JWT-based sign-in scaffold. Keep the modular structure and comments. Do not remove existing functionality—just enhance it.

Code:
{original_code}
"""

response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": prompt}],
    temperature=0.3
)

new_code = response['choices'][0]['message']['content']

with open("js/auth.js", "w", encoding="utf-8") as f:
    f.write(new_code)
