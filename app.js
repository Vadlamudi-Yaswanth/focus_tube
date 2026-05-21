const btn = document.getElementById('searchBtn');
const input = document.getElementById('userQuery');
const results = document.getElementById('videoResults');
const status = document.getElementById('status');

const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : ''

btn.addEventListener('click', startSearch);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') startSearch();
});

async function startSearch() {
  const query = input.value.trim();
  if (!query) return;

  results.innerHTML = '';
  status.innerHTML = '<p>AI is filtering the best tutorials for you...</p>';

  try {
    const response = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.details || data?.error || 'Search failed');
    }

    status.innerHTML = '';
    render(data);
  } catch (error) {
    console.error('Connection Error:', error);
    status.innerHTML = `<p>${error.message}</p>`;
  }
}

function render(list) {
  if (!list || list.length === 0) {
    results.innerHTML = '<p>No educational videos found for this topic.</p>';
    return;
  }

  list.forEach((v) => {
    results.innerHTML += `
      <div class="card">
        <iframe 
          src="https://www.youtube.com/embed/${v.id.videoId}" 
          allowfullscreen>
        </iframe>
        <div class="info">
          <h3>${v.snippet.title}</h3>
          <p>${v.snippet.channelTitle}</p>
        </div>
      </div>`;
  });
}
