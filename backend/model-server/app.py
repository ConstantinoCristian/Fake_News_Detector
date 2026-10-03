from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()
clf = pipeline("text-classification", model="jy46604790/Fake-News-Bert-Detect")

class Item(BaseModel):
    inputs: str

@app.post("/predict")
def predict(item: Item):
    return clf(item.inputs, truncation=True, max_length=512)