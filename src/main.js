// main.js
const urlInput = document.getElementById('urlInput');
const openBtn = document.getElementById('openBtn');
const clearBtn = document.getElementById('clearBtn');
const historyList = document.getElementById('historyList');

// Load recent input history
function loadHistory() {
  fetch('/api/history')
    .then(res => res.json())
    .then(data => {
      historyList.innerHTML = '';
      data.forEach((item, idx) => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center bg-gray-100 p-2 rounded';
        li.innerHTML = `
          <span class="truncate">${item.replace(/\n/g, ' | ')}</span>
          <button class="ml-2 text-red-500" onclick="deleteHistory(${idx})">Delete</button>
        `;
        li.onclick = () => urlInput.value = item;
        historyList.appendChild(li);
      });
    });
}

// Delete a history record
window.deleteHistory = function(idx) {
  fetch('/api/history/' + idx, { method: 'DELETE' })
    .then(() => loadHistory());
}

// Open all URLs
openBtn.onclick = () => {
  const urls = urlInput.value.split('\n').map(u => u.trim()).filter(Boolean);
  if (urls.length === 0) return;
  urls.forEach(url => {
    let link = url;
    if (!/^https?:\/\//.test(link)) link = 'http://' + link;
    window.open(link, '_blank');
  });
  // Save to history
  fetch('/api/history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: urlInput.value })
  }).then(() => loadHistory());
};

// Clear input box
clearBtn.onclick = () => urlInput.value = '';

// Initialize
loadHistory(); 