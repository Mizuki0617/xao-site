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
