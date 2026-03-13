# Fake News Detector

A full-stack web app that analyses news articles for credibility using a pre-trained BERT model. You paste a URL, it scrapes the article, runs it through the model and tells you if it's real or fake with a confidence score.

## How it works

The app has three layers:

1. **React frontend** — built with Vite and Tailwind. You paste a news article URL, it sends it to the backend and displays the result with a pie chart and gauge visualization.

2. **Node/Express backend** — receives the URL, scrapes the article using JSDOM and Mozilla Readability to extract clean text, then calls the Hugging Face Inference API with the text.

3. **Hugging Face Inference API** — runs the text through `jy46604790/Fake-News-Bert-Detect`, a RoBERTa model trained on over 40,000 news articles. Returns REAL or FAKE with a confidence score.

## Features

- Analyze any news article by URL
- REAL/FAKE verdict with confidence percentage
- Save analyses to your personal history
- JWT authentication with bcrypt password hashing
- Sidebar with history dropdown and delete
- Info page with WebGL dither animation background
- Report incorrect predictions via embedded form

## Tech Stack

- **Frontend** — React, Vite, Tailwind CSS, MUI Charts, Three.js
- **Backend** — Node.js, Express, PostgreSQL, JWT, bcrypt
- **ML** — Hugging Face Inference API (RoBERTa BERT model)
- **Database** — Supabase (PostgreSQL)
- **Deployment** — Vercel (frontend), Railway (backend), Hugging Face (model inference)

## The Model

The model `jy46604790/Fake-News-Bert-Detect` was already fine-tuned on a large fake news dataset — training from scratch would require significant GPU compute and weeks of work. The engineering effort here was building the full production system around it: the scraping pipeline, the API layer, authentication, database, and frontend.

- `LABEL_0` = Fake news
- `LABEL_1` = Real news

## Running Locally

**Backend**
```bash
cd backend
npm install
node server.js
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Environment variables**

Backend `.env`:
```
PORT=5000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
HF_TOKEN=your_huggingface_token
```

Frontend `.env`:
```
VITE_API_URL=http://localhost:5000
VITE_API_AUTH=http://localhost:5000/api/auth
```

## Challenges

The original architecture had a Python FastAPI microservice running the BERT model locally using the transformers library. That code is still in the repo under `ml-service` and works perfectly fine locally. The problem came at deployment — the BERT model and its dependencies (torch, transformers, tokenizers) pushed the Docker image to around 7.7GB which exceeded Railway's free tier limit of 4GB. Render's free tier only gives you 512MB of RAM which the model blew through instantly on startup.

To keep the deployment free I replaced the local inference with a direct call to the Hugging Face Inference API from the Node backend. Same model, same results, but the heavy computation happens on Hugging Face's servers instead of mine.
