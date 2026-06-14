document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');

  window.addEventListener('scroll', () => {
    header.classList.toggle('solid', window.scrollY > 60);
  });

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }
});

// Hero slideshow
function initSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  let current = 0;

  function next() {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }

  // 第一張是影片，等影片播完後才切換；其他張固定 6 秒
  const video = slides[0].querySelector('video');
  if (video) {
    video.addEventListener('ended', () => {
      next();
      setInterval(next, 6000);
    });
    // 如果影片超過 15 秒就強制切換
    setTimeout(() => {
      if (current === 0) { next(); setInterval(next, 6000); }
    }, 15000);
  } else {
    setInterval(next, 6000);
  }
}

document.addEventListener('DOMContentLoaded', initSlideshow);
