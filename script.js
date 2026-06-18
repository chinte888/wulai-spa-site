document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  
  // 頁首滾動時切換背景色
  window.addEventListener('scroll', () => {
    header.classList.toggle('solid', window.scrollY > 60);
  });
  
  // 行動選單開關與文字切換
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.textContent = isOpen ? 'CLOSE' : 'MENU';
      document.body.classList.toggle('nav-open', isOpen);
    });
  }
});

// 首頁投影片輪播控制 (效能優化版)
function initSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  let current = 0;
  let timer = null;

  function goNext() {
    // 暫停即將切入背景的影片
    const currentVideo = slides[current].querySelector('video');
    if (currentVideo) {
      currentVideo.pause();
    }

    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
    scheduleNext();
  }

  function scheduleNext() {
    clearTimeout(timer);
    const slide = slides[current];
    const video = slide.querySelector('video');
    if (video) {
      video.currentTime = 0;
      video.play()
        .then(() => {
          video.onended = goNext;
        })
        .catch(err => {
          console.log("影片播放受阻（可能受限於瀏覽器政策），啟用自動切換備案：", err);
          // 影片播放失敗或被瀏覽器政策阻擋時，設定 5 秒後自動切換至下一張投影片，防止畫面凍結
          timer = setTimeout(goNext, 5000);
        });
    } else {
      timer = setTimeout(goNext, 5000);
    }
  }

  // 初始化：預先暫停所有非第一張的影片，避免背景背景加載消耗頻寬
  slides.forEach((slide, idx) => {
    const video = slide.querySelector('video');
    if (video && idx !== 0) {
      video.pause();
    }
  });

  scheduleNext();
}

// 動態更新訂房連結至當前日期，並開啟新分頁
function updateBookingLinks() {
  const links = document.querySelectorAll('a[href*="bw.tripla.ai"]');
  if (!links.length) return;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}%2F${mm}%2F${dd}`;
  };

  const todayStr = formatDate(today);
  const tomorrowStr = formatDate(tomorrow);

  links.forEach(link => {
    let href = link.getAttribute('href');
    if (!href) return;
    // 取代網址中舊有的過期日期
    href = href.replace(/checkin=[^&]*/, `checkin=${todayStr}`);
    href = href.replace(/checkout=[^&]*/, `checkout=${tomorrowStr}`);
    link.setAttribute('href', href);
    
    // 設定以新視窗開啟，並防範安全性風險
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
  });
}

// 初始化語言切換器選單連結與點擊事件
function initLanguageSwitcher() {
  const btn = document.getElementById('langBtn');
  const dropdown = document.getElementById('langDropdown');
  if (!btn || !dropdown) return;

  // 1. 動態解析當前頁面名稱
  const pathParts = window.location.pathname.split('/');
  const currentPage = pathParts[pathParts.length - 1] || 'index.html';
  // 檢查當前是否在子目錄（en, ja, ko）中
  const currentDir = pathParts[pathParts.length - 2];
  const isSubdir = ['en', 'ja', 'ko'].includes(currentDir);
  const rootPrefix = isSubdir ? '../' : '';

  // 2. 更新下拉選單中的各語言超連結
  dropdown.querySelector('.lang-zh').setAttribute('href', `${rootPrefix}${currentPage}`);
  dropdown.querySelector('.lang-en').setAttribute('href', `${rootPrefix}en/${currentPage}`);
  dropdown.querySelector('.lang-ja').setAttribute('href', `${rootPrefix}ja/${currentPage}`);
  dropdown.querySelector('.lang-ko').setAttribute('href', `${rootPrefix}ko/${currentPage}`);

  // 3. 行動版點擊展開/收合選單
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open-mobile');
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('open-mobile');
  });
}

document.addEventListener('DOMContentLoaded', initSlideshow);
document.addEventListener('DOMContentLoaded', updateBookingLinks);
document.addEventListener('DOMContentLoaded', initLanguageSwitcher);

