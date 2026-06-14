async function loadNews() {
  try {
    const res = await fetch('content/news.json');
    const data = await res.json();
    const items = (data.items || []).slice().sort((a, b) => b.date.localeCompare(a.date));
    const formatDate = (d) => d.replace(/-/g, '.');

    // 首頁橫向版型
    const band = document.getElementById('news-band-list');
    if (band) {
      band.innerHTML = items.slice(0, 3).map(item => `
        <a href="news.html" class="news-band-item">
          <div class="news-band-title">${item.title}</div>
          <div class="news-band-date">${formatDate(item.date)}</div>
        </a>
      `).join('');
    }

    // 最新消息頁完整列表
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
  } catch (e) {
    console.error('讀取最新消息失敗', e);
  }
}
document.addEventListener('DOMContentLoaded', loadNews);
