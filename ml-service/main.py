import os
import httpx
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")
MODEL = "jy46604790/Fake-News-Bert-Detect"

class ArticleBody(BaseModel):
    content: str

app = FastAPI()

@app.post("/fakeBERT/")
async def create_article_body(body: ArticleBody):
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    payload = {"inputs": body.content[:512]}
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"https://api-inference.huggingface.co/models/{MODEL}",
            headers=headers,
            json=payload
        )
    print("HF response:", response.json())
    result = response.json()[0][0]
    label = "TRUE" if result["label"] == "LABEL_1" else "FALSE"
    return {"label": label, "score": result["score"]}