import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import cookieParsers from "cookie-parser";
import {Readability} from '@mozilla/readability'
import { JSDOM } from "jsdom"
import axios from "axios";
import authRoutes from "./routes/auth.js"

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParsers());

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.includes('vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}))

app.get("/", (req,res) => {
    res.json({message:"Hello world"});
})

app.post("/urlCheck", async (req,res)=>{
    console.log("Received body:", req.body);
    console.log("userInput:", req.body.userInput);
    try {
        const {userInput} = req.body;

        if (!userInput) {
            return res.json({output: {label: "Invalid url", score: ""}});
        }

        console.log("Fetching URL...");
        const htmlResponse = await fetch(userInput, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        console.log("Fetch status:", htmlResponse.status);

        const htmlText = await htmlResponse.text();
        const doc = new JSDOM(htmlText, { url: userInput });
        const reader = new Readability(doc.window.document);
        const article = reader.parse();

        if (!article || !article.content) {
            return res.json({output: {label: "Could not extract article content", score: ""}});
        }

        const plainText = article.content.replace(/<[^>]*>/g, '').trim();

        if (!plainText) {
            return res.json({output: {label: "No readable text content found", score: ""}});
        }

        console.log("Calling ML service at:", process.env.ML_SERVICE_URL);
        const pythonResponse = await axios.post(`${process.env.ML_SERVICE_URL}/fakeBERT/`, {content: plainText});
        console.log("ML response:", pythonResponse.data);

        return res.json({output: pythonResponse.data})

    } catch(e) {
        console.log("Error:", e.message);
        return res.json({output: {label: e.message, score: ""}})
    }
})

app.use("/api/auth",authRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Working on port: ${PORT}`)
})