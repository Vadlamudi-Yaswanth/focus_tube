const btn = document.getElementById('searchBtn');
const input = document.getElementById('userQuery');
const results = document.getElementById('videoResults');
const status = document.getElementById('status');

btn.addEventListener('click', startSearch);
input.addEventListener('keypress', (e) => { if (e.key === 'Enter') startSearch(); });

async function startSearch() {
    const query = input.value.trim();
    if (!query) return;

    results.innerHTML = "";
    status.innerHTML = '<p>🤖 AI is filtering the best tutorials for you...</p>';

    try {
        // Call our Backend (which now does YouTube + AI filtering)
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

        if (!response.ok) throw new Error("Backend server is not responding!");

        const filteredData = await response.json();

        status.innerHTML = ""; // Clear the status
        render(filteredData);

    } catch (error) {
        console.error("Connection Error:", error);
        status.innerHTML = "";
        alert("Make sure your Node.js server is running in the terminal!");
    }
}

function render(list) {
    if (!list || list.length === 0) {
        results.innerHTML = "<p>No educational videos found for this topic.</p>";
        return;
    }
    list.forEach(v => {
        results.innerHTML += `
            <div class="card">
                <iframe src="https://www.youtube.com/embed/${v.id.videoId}" allowfullscreen></iframe>
                <div class="info">
                    <h3>${v.snippet.title}</h3>
                    <p>${v.snippet.channelTitle}</p>
                </div>
            </div>`;
    });
}