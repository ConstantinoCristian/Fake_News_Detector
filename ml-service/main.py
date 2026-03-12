import os
from huggingface_hub import InferenceClient
from transformers import pipeline, AutoTokenizer
from dotenv import load_dotenv

#.\venv\Scripts\Activate.ps1

#API
from fastapi import FastAPI
from pydantic import BaseModel

load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")

MODEL = "jy46604790/Fake-News-Bert-Detect"


tokenizer = None
clf = None

def load_model():
    global tokenizer, clf
    if clf is None:
        print("Loading model and tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained(MODEL)
        clf = pipeline("text-classification", model=MODEL, tokenizer=MODEL)
        print("Model loaded successfully!")

class ArticleBody(BaseModel):
    content : str


app = FastAPI()

@app.on_event("startup")
async def startup_event():
    load_model()

@app.get("/")
def health_check():
    return {"status": "alive"}

@app.post("/fakeBERT/")
async def create_article_body(body: ArticleBody):
    try:
        if not body.content or len(body.content.strip()) == 0:
            return {"error": "Empty content provided"}

        tokens = tokenizer.encode(body.content, max_length=512, truncation=True)
        truncated_text = tokenizer.decode(tokens, skip_special_tokens=True)

        if not truncated_text or len(truncated_text.strip()) == 0:
            return {"error": "No valid text after processing"}

        result = clf(truncated_text)
        if result[0]["label"] == "LABEL_1":
            result[0]["label"] = "TRUE"
        else:
            result[0]["label"] = "FALSE"

        return {"label": result[0]["label"], "score": result[0]["score"]}
    except Exception as e:
        print(f"Error in endpoint: {str(e)}")
        return {"error": str(e)}

