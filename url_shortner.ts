<script>
    const API_BASE = 'https://ulvis.net/api/v1';
    const form = document.getElementById('shorten-form');
    const input = document.getElementById('long-url');
    const resultContainer = document.getElementById('result-container');
    const message = document.getElementById('message');

    function clearMessage() {
      message.style.display = 'none';
      message.className = 'message';
      message.textContent = '';
    }

    function showMessage(msg, isError = false) {
      message.textContent = msg;
      message.className = isError ? 'message error' : 'message';
      message.style.display = 'block';
    }

    function createResultCard(shortUrl) {
      const card = document.createElement('div');
      card.className = 'result-card';

      const urlLink = document.createElement('a');
      urlLink.href = shortUrl;
      urlLink.textContent = shortUrl;
      urlLink.className = 'result-url';
      urlLink.target = '_blank';
      urlLink.rel = 'noopener noreferrer';

      urlLink.addEventListener('dblclick', async e => {
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(shortUrl);
          showMessage('Short URL copied to clipboard!');
        } catch {
          showMessage('Failed to copy.', true);
        }
      });

      card.appendChild(urlLink);
      return card;
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      clearMessage();
      resultContainer.innerHTML = '';
      const longUrl = input.value.trim();
      if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
        showMessage('Please enter a valid HTTP or HTTPS URL.', true);
        return;
      }
      form.querySelector('button').disabled = true;
      try {
        const res = await fetch(\`\${API_BASE}/shorten\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: longUrl })
        });
        const data = await res.json();
        if (data && data.short) {
          const card = createResultCard(data.short);
          resultContainer.appendChild(card);
          showMessage('Short URL created! Double-click it to copy.');
          input.value = '';
        } else {
          showMessage(data.error || 'Failed to shorten URL.', true);
        }
      } catch (err) {
        showMessage('Network or API error.', true);
      }
      form.querySelector('button').disabled = false;
    });

    input.addEventListener('input', clearMessage);
  </script>