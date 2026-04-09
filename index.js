const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load .env from backend/ folder regardless of where node is run from
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Serve frontend static files from the root project directory
app.use(express.static(path.join(__dirname, '..')));

app.use(cors());
app.use(express.json());




app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        const YT_KEY = process.env.YT_API_KEY;

        // 1. Fetch from YouTube
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}&type=video&key=${YT_KEY}`;
        const ytResponse = await axios.get(url);
        const videos = ytResponse.data.items;

        // 2. Try to filter with Gemini AI (graceful fallback if rate-limited)
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            const titles = videos.map((v, i) => `${i}: ${v.snippet.title}`).join("\n");
            const prompt = `User wants to learn: ${query}. Look at these titles and return ONLY the numbers of the best educational tutorials. Return format: 0,1,2. Titles:\n${titles}`;

            const result = await model.generateContent(prompt);
            const aiText = result.response.text();

            const indices = aiText.replace(/[^0-9,]/g, '').split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
            const filteredVideos = videos.filter((_, i) => indices.includes(i));

            return res.json(filteredVideos.length > 0 ? filteredVideos : videos);
        } catch (aiError) {
            console.warn("Gemini AI filtering skipped (falling back to all results):", aiError.message);
            // Fallback: return all YouTube results without AI filtering
            return res.json(videos);
        }

    } catch (error) {
        console.error("YouTube API Error:", error.message || error);
        res.status(500).json({ error: "YouTube search failed", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Backend Server ready at http://localhost:${PORT}`);
});