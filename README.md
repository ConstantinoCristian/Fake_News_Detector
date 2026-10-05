Fake News Detector

Update: The live demo is no longer running. The hosting trial has ended and Hugging Face has stopped serving this model through its Inference API (see "Update: model endpoint deprecated" at the bottom). You can still run the full project locally using the steps below.

A full-stack web app that analyses news articles for credibility using a pre-trained BERT model. You paste a URL, it scrapes the article, runs it through the model and tells you if it's real or fake with a confidence score.

How it works

The app has three layers:

React frontend,built with Vite and Tailwind. You paste a news article URL, it sends it to the backend and displays the result.
Node/Express backend,receives the URL, scrapes the article using JSDOM and Mozilla Readability to extract clean text, then sends it to the ML service.
Python ML service (FastAPI),runs the text through jy46604790/Fake-News-Bert-Detect, a RoBERTa model trained on over 40,000 news articles, using the transformers library. Returns REAL or FAKE with a confidence score.
Features
Analyze any news article by URL
REAL/FAKE verdict with confidence percentage
Save analyses to your personal history
JWT authentication with bcrypt password hashing
Sidebar with history dropdown and delete
Info page with WebGL dither animation background
Report incorrect predictions via embedded form
Tech Stack
Frontend — React, Vite, Tailwind CSS, MUI Charts, Three.js
Backend — Node.js, Express, PostgreSQL, JWT, bcrypt
ML — Python, FastAPI, Hugging Face Transformers (RoBERTa model, runs locally)
Database — PostgreSQL (originally hosted on Supabase; any PostgreSQL works locally)
Deployment — originally Vercel (frontend) and Railway (backend); no longer live
The Model

The model jy46604790/Fake-News-Bert-Detect was already fine-tuned on a large fake news dataset , training from scratch would require significant GPU compute and weeks of work. The engineering effort here was building the full system around it: the scraping pipeline, the API layer, authentication, database, and frontend.

LABEL_0 = Fake news
LABEL_1 = Real news

The prediction is an estimate from a model trained on a specific dataset, not a verdict on whether an article is true.

Running Locally

Prerequisites: Node.js, Python 3.10+, PostgreSQL (or a free Supabase project). Run each part in a separate terminal, starting with the ML service.

ML service
bash
cd ml-service
pip install -r requirements.txt
python -m uvicorn app:app --port 8000

The model (about 500 MB) is downloaded automatically on first run. Predictions can take a few seconds on CPU.

Backend
bash
cd backend
npm install
node server.js
Frontend
bash
cd frontend
npm install
npm run dev
Environment variables

Create backend/.env:

PORT=5000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=any_long_random_string
CLIENT_URL=http://localhost:5173

Create frontend/.env:

VITE_API_URL=http://localhost:5000
VITE_API_AUTH=http://localhost:5000/api/auth

CLIENT_URL must match the address the frontend runs on exactly (check the Vite terminal output), otherwise the browser blocks requests with a CORS error. Multiple addresses can be separated by commas.

Restart the servers after changing any .env file.

Challenges

The original architecture had a Python FastAPI microservice running the BERT model locally using the transformers library. That code is still in the repo under ml-service and works perfectly fine locally. The problem came at deployment, the BERT model and its dependencies (torch, transformers, tokenizers) pushed the Docker image to around 7.7GB which exceeded Railway's free tier limit of 4GB. Render's free tier only gives you 512MB of RAM which the model blew through instantly on startup.

To keep the deployment free I replaced the local inference with a direct call to the Hugging Face Inference API from the Node backend. Same model, same results, but the heavy computation happened on Hugging Face's servers instead of mine.

Update: model endpoint deprecated

After deployment, Hugging Face removed this model from its hosted Inference API. Requests started failing with HTTP 410 ("The requested model is deprecated and no longer supported by provider hf-inference"), even though the model is still available on the Hub. Together with the end of the Railway trial, this took the live demo offline.

Because the original FastAPI service is still in the repo, the project runs fully locally: the backend now calls the local ML service (http://localhost:8000/predict) instead of the Hugging Face API, and no Hugging Face token is needed.

Lessons learned: relying on a free third-party inference API means the model can disappear without any change in your own code. Keeping a self-hosted fallback and checking provider status early would have avoided the downtime.
