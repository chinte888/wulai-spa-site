function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function loadNews() {
  // 1. 偵測當前網頁是否在語系子目錄中，取得資源相對路徑與語言代碼
  const pathParts = window.location.pathname.split('/');
  const currentDir = pathParts[pathParts.length - 2];
  const isSubdir = ['en', 'ja', 'ko'].includes(currentDir);
  const rootPrefix = isSubdir ? '../' : '';
  const lang = isSubdir ? currentDir : 'zh';

  // 2. 設置語系專屬的 UI 文字字典
  const messages = {
    zh: { noNews: "目前暫無最新消息", error: "最新消息載入失敗，請稍後再試。", errorFull: "最新消息載入失敗，請重新整理網頁或聯絡會館。" },
    en: { noNews: "No news currently available.", error: "Failed to load news, please try again later.", errorFull: "Failed to load news, please refresh the page or contact us." },
    ja: { noNews: "現在、最新情報はありません。", error: "最新情報の読み込みに失敗しました。後でもう一度お試しください。", errorFull: "最新情報の読み込みに失敗しました。ページを再読み込みするか、当館までお問い合わせください。" },
    ko: { noNews: "현재 등록된 소식이 없습니다.", error: "소식을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.", errorFull: "소식을 불러오지 못했습니다. 페이지를 새로고침하거나 회관으로 문의해 주세요." }
  };
  const msg = messages[lang] || messages.zh;

  try {
    const res = await fetch(`${rootPrefix}content/news.json?t=${Date.now()}`);
    const data = await res.json();
    
    // 過濾無效或缺失日期與中文標題的項目，並進行安全排序
    const items = (data.items || [])
      .filter(item => item && typeof item.date === 'string' && typeof item.title === 'string')
      .slice()
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const formatDate = (d) => (d || '').replace(/-/g, '.');

    // 取得對應語系的文字，若無翻譯則回退至中文 (zh)
    const getLangValue = (item, key) => {
      if (lang === 'zh') return item[key];
      const localizedKey = `${key}_${lang}`;
      return item[localizedKey] || item[key];
    };

    // 首頁橫向版型
    const band = document.getElementById('news-band-list');
    if (band) {
      if (items.length === 0) {
        band.innerHTML = `<div style="padding: 20px; color: #7A6B55;">${msg.noNews}</div>`;
      } else {
        band.innerHTML = items.slice(0, 3).map(item => `
          <a href="news.html" class="news-band-item">
            <div class="news-band-title">${escapeHTML(getLangValue(item, 'title'))}</div>
            <div class="news-band-date">${formatDate(item.date)}</div>
          </a>
        `).join('');
      }
    }

    // 最新消息頁完整列表
    const fullList = document.getElementById('news-list-full');
    if (fullList) {
      if (items.length === 0) {
        fullList.innerHTML = `<div style="text-align:center; padding: 60px 8%; color: var(--ink-soft);">${msg.noNews}</div>`;
      } else {
        fullList.innerHTML = items.map(item => `
          <div class="news-row">
            <div class="news-date">${formatDate(item.date)}</div>
            <div class="news-body">
              <h3>${escapeHTML(getLangValue(item, 'title'))}</h3>
              <p>${escapeHTML(getLangValue(item, 'body'))}</p>
            </div>
          </div>
        `).join('');
      }
    }
  } catch (e) {
    console.error('讀取最新消息失敗', e);
    const band = document.getElementById('news-band-list');
    if (band) {
      band.innerHTML = `<div style="padding: 20px; color: #7A6B55;">${msg.error}</div>`;
    }
    const fullList = document.getElementById('news-list-full');
    if (fullList) {
      fullList.innerHTML = `<div style="text-align:center; padding: 60px 8%; color: var(--ink-soft);">${msg.errorFull}</div>`;
    }
  }
}
document.addEventListener('DOMContentLoaded', loadNews);
