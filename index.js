const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load .env from backend/ folder regardless of where node is run from
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Serve frontend static files from the root project directory
app.use(express.static(path.join(__dirname, '..')));

app.use(cors());
app.use(express.json());
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
app.get('/api/search', async (req, res) => {
  try {
    const query = (req.query.q || '').trim();
    const YT_KEY = process.env.YT_API_KEY;
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    if (!query) {
      return res.status(400).json({ error: 'Missing query', details: 'Please pass ?q=your_topic' });
    }

    if (!YT_KEY) {
      return res.status(500).json({ error: 'Missing YT_API_KEY', details: 'Set YT_API_KEY in backend/.env' });
    }

    // Fetch from YouTube
    const ytResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        maxResults: 10,
        q: query,
        videoEmbeddable: 'true',
        type: 'video',
        key: YT_KEY
      },
      timeout: 15000,
      // Avoid broken proxy env values (e.g., 127.0.0.1:9) for this external API call.
      proxy: false
    });

    const videos = ytResponse?.data?.items || [];

    // Try to filter with Gemini AI (graceful fallback)
    if (!GEMINI_KEY) {
      return res.json(videos);
    }

    try {

      const titles = videos.map((v, i) => `${i}: ${v.snippet.title}`).join('\n');
      const prompt = `User wants to learn: ${query}. Look at these titles and return ONLY the numbers of the best educational tutorials. Return format: 0,1,2. Titles:\n${titles}`;

      const result = await model.generateContent(prompt);
      const aiText = result.response.text();

      const indices = aiText
        .replace(/[^0-9,]/g, '')
        .split(',')
        .map((n) => parseInt(n.trim(), 10))
        .filter((n) => !Number.isNaN(n));

      const filteredVideos = videos.filter((_, i) => indices.includes(i));
      return res.json(filteredVideos.length > 0 ? filteredVideos : videos);
    } catch (aiError) {
      console.warn('Gemini AI filtering skipped (falling back to all results):', aiError.message);
      return res.json(videos);
    }
  } catch (error) {
    console.error('YouTube API Error:', error.message || error);
    return res.status(500).json({ error: 'YouTube search failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server ready at http://localhost:${PORT}`);
});
