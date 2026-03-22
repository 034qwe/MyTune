from g4f.client import Client

def gpt_call(content):
    client = Client()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": content}],
        web_search=False
    )
    return {'resp': response.choices[0].message.content}