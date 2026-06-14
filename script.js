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
  let timer = null;

  function goNext() {
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
      video.play();
      video.onended = goNext;
    } else {
      timer = setTimeout(goNext, 5000);
    }
  }

  scheduleNext();
}

document.addEventListener('DOMContentLoaded', initSlideshow);
