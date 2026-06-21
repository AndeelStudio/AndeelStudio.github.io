/* ================================================================
   ANDEEL STUDIO — script.js
   ================================================================ */

'use strict';

// ----------------------------------------------------------------
// 1. NAV — Scrolled state + mobile toggle
// ----------------------------------------------------------------
const header     = document.getElementById('site-header');
const navToggle  = document.getElementById('nav-toggle');
const navLinks   = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile nav when a link is clicked
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});


// ----------------------------------------------------------------
// 2. SCROLL ANIMATIONS — Fade-up on elements entering viewport
// ----------------------------------------------------------------
const fadeTargets = document.querySelectorAll(
  '.about-grid, .spotlight-card, .craft-card, .pipeline-text, .contact-inner, .section-header'
);

fadeTargets.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings within the same parent
      const siblings = Array.from(entry.target.parentElement?.children ?? [entry.target]);
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 80}ms`;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -48px 0px'
});

fadeTargets.forEach(el => observer.observe(el));


// ----------------------------------------------------------------
// 3. DYNAMIC FOOTER YEAR
// ----------------------------------------------------------------
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// ----------------------------------------------------------------
// 4. ACTIVE NAV LINK — Highlight based on current scroll section
// ----------------------------------------------------------------
const sections    = document.querySelectorAll('section[id]');
const navLinkEls  = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    if (
      scrollY >= section.offsetTop &&
      scrollY < section.offsetTop + section.offsetHeight
    ) {
      navLinkEls.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${section.id}`
        );
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();


// ----------------------------------------------------------------
// 5. SPOTLIGHT IMAGE GALLERY
//    (Activates when thumbnail-strip is uncommented in HTML)
// ----------------------------------------------------------------
const thumbs    = document.querySelectorAll('.thumb');
const spotlightMedia = document.getElementById('spotlight-media');

if (thumbs.length > 0 && spotlightMedia) {
  // Inject a main image element for gallery display
  const mainImg = document.createElement('img');
  mainImg.className = 'spotlight-img';
  mainImg.alt = 'VR Classroom Screenshot';

  // Set initial image from the first active thumb
  const activeThumb = document.querySelector('.thumb.active');
  if (activeThumb) {
    mainImg.src = activeThumb.dataset.full;
    spotlightMedia.prepend(mainImg);
  }

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = thumb.dataset.full;
        mainImg.style.opacity = '1';
      }, 150);
    });
  });

  // Add transition for the gallery swap
  mainImg.style.transition = 'opacity 150ms ease';
}


// ----------------------------------------------------------------
// 6. SMOOTH SCROLL POLYFILL (for browsers without native support)
// ----------------------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ----------------------------------------------------------------
// 7. PIPELINE CARD GHOST — subtle parallax on scroll
// ----------------------------------------------------------------
const ghosts = document.querySelectorAll('.pipeline-card-ghost');

if (ghosts.length > 0) {
  const pipelineSection = document.querySelector('.pipeline');
  window.addEventListener('scroll', () => {
    if (!pipelineSection) return;
    const rect = pipelineSection.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, 1 - rect.bottom / window.innerHeight));
    ghosts.forEach((ghost, i) => {
      ghost.style.transform = `translateY(${progress * (i + 1) * -8}px)`;
    });
  }, { passive: true });
}


// ----------------------------------------------------------------
// 8. SEAMLESS MARQUEE
//    Picks the single .marquee-track from HTML, wraps it alongside
//    a cloned copy inside an animated .marquee-wrapper div.
//    The -50% animation moves the wrapper by exactly one track width,
//    creating a perfect endless loop with no visible reset jump.
//    padding-right on each track (set in CSS) bridges the seam gap.
// ----------------------------------------------------------------
(function initMarquee() {
  const strip = document.querySelector('.marquee-strip');
  const track = document.getElementById('marquee-track');
  if (!strip || !track) return;

  // Build the animated wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'marquee-wrapper';

  // Clone must be aria-hidden so screen readers don't double-read
  const clone = track.cloneNode(true);
  clone.removeAttribute('id');
  clone.setAttribute('aria-hidden', 'true');

  wrapper.appendChild(track);   // move original into wrapper
  wrapper.appendChild(clone);   // append pixel-perfect clone
  strip.appendChild(wrapper);   // put wrapper into the strip
})();
