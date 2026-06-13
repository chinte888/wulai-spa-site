async function loadNews() {
  try {
    const res = await fetch('content/news.json');
    const data = await res.json();
    const items = (data.items || []).slice().sort((a, b) => b.date.localeCompare(a.date));

    const formatDate = (d) => d.replace(/-/g, '.');

    const fullList = document.getElementById('news-list-full');
    if (fullList) {
      fullList.innerHTML = items.map(item => `
        <div class="news-row">
          <div class="news-date">${formatDate(item.date)}</div>
          <div class="news-body">
            <h3>${item.title}</h3>
            <p>${item.body}</p>
          </div>
        </div>
      `).join('');
    }

    const grid = document.getElementById('news-grid');
    if (grid) {
      const colors = ['', ' n2', ' n3'];
      grid.innerHTML = items.slice(0, 3).map((item, i) => `
        <a href="news.html" class="news-card">
          <div class="news-img${colors[i % colors.length]}"></div>
          <div class="news-date">${formatDate(item.date)}</div>
          <h3>${item.title}</h3>
        </a>
      `).join('');
    }
  } catch (e) {
    console.error('讀取最新消息失敗', e);
  }
}

document.addEventListener('DOMContentLoaded', loadNews);
