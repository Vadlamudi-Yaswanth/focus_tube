# FocusTube

AI-Filtered Educational Content — distraction free YouTube learning.

## Live Demo
https://focus-tube-x96o.onrender.com

## Problem it Solves
YouTube's ads and recommendations make focused learning 
difficult. FocusTube uses YouTube Data API + Gemini AI 
to filter and show only the top educational content.

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- YouTube Data API v3
- Google Gemini AI API
- Deployed on Render
- 
- ## System Architecture Upgrades (Backend & Data)
User Authentication:

Implement JWT (JSON Web Tokens) or OAuth 2.0 (Google Sign-In) for session management.

Database Integration:

Connect PostgreSQL / MongoDB to store user search history, bookmarked educational videos, and custom playlists.

Caching & Performance Layer:

Integrate Redis to cache YouTube API responses and Gemini score results.

Goal: Reduce external API calls, bypass rate limits, and cut response latency from ~1.5s to <100ms for cached queries.

# # Hybrid Search & Precision Pipeline (Addressing False Negatives)
To ensure users never miss valuable videos or lose trust in the filtering system:

Two-Stage Retrieval:

Broad Recall: Fetch top 30–50 candidates from the YouTube Data API.

AI Ranking: Pass candidate metadata through Gemini API to assign an "Educational Score" (0–100) based on channel reputation, video description, title, and topic alignment.

User Fallback / Control Options:

Strict vs. Moderate Mode: Let users toggle between strictly filtered educational content and broad search results.

Direct URL/ID Import: Allow users to paste a specific YouTube URL/ID to view any video inside the distraction-free UI.

Raw Search View: A distraction-free fallback mode displaying standard search results without recommended sidebars, Shorts, or comment sections.

## ⚡ Hybrid Educational Pipeline: Long-Form & Short-Form Content

FocusTube prioritizes educational efficiency while keeping friction low for learners. Rather than forcing users to choose content formats upfront, search results present both **In-Depth Tutorials** and **Quick Concept Recaps (Shorts)** within a unified, distraction-free environment.

### 🎯 Design Philosophy & User Experience
* **Zero Decision Friction:** Eliminates upfront prompts asking users for content length preferences, allowing instant access to search results.
* **Dual Learning Modes:**
  * **Quick Context (Shorts):** Best for fast mental models, visual intuition, and 60-second topic refreshers before diving deep.
  * **In-Depth Lessons (Long-Form):** Best for end-to-end implementations, code-alongs, and detailed conceptual proofs.
* **Prevents Algorithmic Traps:** By embedding Shorts within FocusTube's clean UI (no endless scroll feeds, comments, or viral sidebars), users get quick context without getting pulled into YouTube's recommendation loops.

### 🛡️ AI Filtering & Quality Control for Shorts
YouTube Shorts naturally carry a higher proportion of clickbait and non-educational distraction. To protect learning quality:
1. **Strict Gemini Scoring:** Short metadata (title, transcript, hashtags) is evaluated against strict educational utility standards before rendering.
2. **Noise Rejection:** Automatically filters out shorts relying purely on comedy skits, viral audio trends, or non-instructive commentary.
3. **Structured UI Layout:** Shorts are displayed in a clean "Quick Recaps" horizontal carousel above main tutorial listings to keep navigation organized and distinct.
