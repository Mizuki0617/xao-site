// ===== Header: スクロールで背景追加 =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== Fade-in: IntersectionObserver =====
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
fadeEls.forEach(el => observer.observe(el));

// Hero の fade-in は即時
document.querySelectorAll('.hero .fade-in').forEach(el => {
  setTimeout(() => el.classList.add('visible'), 300);
});

// ===== Gallery Carousel =====
(function () {
  const track    = document.getElementById('galleryTrack');
  const prevBtn  = document.getElementById('galleryPrev');
  const nextBtn  = document.getElementById('galleryNext');
  const dotsWrap = document.getElementById('galleryDots');
  if (!track) return;

  const items = Array.from(track.querySelectorAll('.gallery-item'));
  let perView = window.innerWidth <= 768 ? 2 : 3;
  let current = 0;
  const total  = items.length;

  function getPerView() { return window.innerWidth <= 768 ? 2 : 3; }
  function maxIndex()   { return Math.ceil(total / perView) - 1; }

  // ドット生成
  function buildDots() {
    dotsWrap.innerHTML = '';
    const pages = Math.ceil(total / perView);
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `ページ ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    Array.from(dotsWrap.querySelectorAll('.gallery-dot')).forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    perView  = getPerView();
    current  = Math.max(0, Math.min(index, maxIndex()));
    const pct = (current * perView / total) * 100;
    track.style.transform = `translateX(-${pct}%)`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= maxIndex();
    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  window.addEventListener('resize', () => {
    perView = getPerView();
    buildDots();
    goTo(Math.min(current, maxIndex()));
  });

  // 初期化
  items.forEach(item => { item.style.flex = `0 0 calc(100% / ${total})`; });
  track.style.width = `${(total / perView) * 100}%`;
  buildDots();
  goTo(0);
})();

// ===== Lightbox =====
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const galleryImgs = Array.from(document.querySelectorAll('.gallery-item img'));
let currentIndex  = 0;

function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = galleryImgs[index].src;
  lightboxImg.alt = galleryImgs[index].alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function showPrev() {
  currentIndex = (currentIndex - 1 + galleryImgs.length) % galleryImgs.length;
  lightboxImg.src = galleryImgs[currentIndex].src;
  lightboxImg.alt = galleryImgs[currentIndex].alt;
}

function showNext() {
  currentIndex = (currentIndex + 1) % galleryImgs.length;
  lightboxImg.src = galleryImgs[currentIndex].src;
  lightboxImg.alt = galleryImgs[currentIndex].alt;
}

galleryImgs.forEach((img, i) => {
  img.parentElement.addEventListener('click', () => openLightbox(i));
  img.parentElement.style.cursor = 'zoom-in';
});

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', showPrev);
document.getElementById('lightboxNext').addEventListener('click', showNext);

lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   showPrev();
  if (e.key === 'ArrowRight')  showNext();
});

// ===== DM テンプレート: コピーボタン =====
(function () {
  const btn = document.getElementById('btnCopy');
  const txt = document.getElementById('dmText');
  if (!btn || !txt) return;
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(txt.textContent.trim()).then(() => {
      btn.textContent = 'コピーしました';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'コピー';
        btn.classList.remove('copied');
      }, 2000);
    });
  });
})();

// ===== ナビ: スムーズスクロール（ヘッダー高さ分オフセット） =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 8;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
