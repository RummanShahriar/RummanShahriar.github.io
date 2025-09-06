/* ====== Smooth center-scroll + active nav + reveal animations ====== */

/* helper: center a section vertically in viewport */
function centerScrollTo(element, behavior='smooth') {
  if (!element) return;
  const elRect = element.getBoundingClientRect();
  const elHeight = elRect.height;
  const viewportHeight = window.innerHeight;
  // We want the element's top positioned so that element is centered
  const targetScroll = window.scrollY + elRect.top - (viewportHeight / 2 - elHeight / 2);
  window.scrollTo({ top: Math.max(0, Math.round(targetScroll)), behavior });
}

/* intercept clicks on nav links */
document.querySelectorAll('#nav-links a, .cta a, #scroll-about').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.dataset.target || (this.getAttribute('href')||'').replace('#','');
    if (!targetId) return;
    const targetEl = document.getElementById(targetId);
    if (!targetEl) {
      // fallback to default anchor behavior
      location.href = this.getAttribute('href');
      return;
    }
    centerScrollTo(targetEl, 'smooth');
    // update URL without jumping
    history.replaceState(null, '', '#' + targetId);
  });
});

/* Active nav detection: use IntersectionObserver near center */
const navLinks = Array.from(document.querySelectorAll('#nav-links a'));
const sectionIds = navLinks.map(a => a.dataset.target || a.getAttribute('href').replace('#',''));
const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

const observerOptions = {
  root: null,
  rootMargin: '-45% 0px -45% 0px', // focus on center 10% area (between 45% top and bottom)
  threshold: 0
};

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // clear active
      navLinks.forEach(a => a.classList.remove('active'));
      // find link that points to this entry
      const id = entry.target.id;
      const link = navLinks.find(a => (a.dataset.target || a.getAttribute('href').replace('#','')) === id);
      if (link) link.classList.add('active');
    }
  });
}, observerOptions);

sections.forEach(s => io.observe(s));

/* reveal animation on scroll */
const reveals = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      // animate skill bars when skills section revealed
      if (e.target.closest('#skills')) {
        document.querySelectorAll('.bar span').forEach(span => {
          const targetW = span.dataset.width || '80%';
          // animate after short delay
          setTimeout(()=> span.style.width = targetW, 120);
        });
      }
      obs.unobserve(e.target);
    }
  });
}, {root:null, rootMargin:'0px 0px -10% 0px', threshold: 0.08});

reveals.forEach(r => revealObserver.observe(r));

/* contact form simple fake send (replace with real endpoint if needed) */
document.getElementById('contact-form').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const status = document.getElementById('form-status');
  status.textContent = 'Sending…';
  // Simulate send
  setTimeout(()=>{
    status.textContent = 'Message sent — thank you! I will reply within 2 business days.';
    document.getElementById('contact-form').reset();
  }, 900);
});

/* On load: if there's a hash, center it */
window.addEventListener('load', () => {
  if (location.hash) {
    const id = location.hash.replace('#','');
    const el = document.getElementById(id);
    if (el) {
      // delay to allow layout
      setTimeout(()=> centerScrollTo(el,'smooth'), 120);
    }
  }
});

/* Make nav links keyboard accessible: press Enter does click behavior */
document.querySelectorAll('#nav-links a').forEach(a=>{
  a.addEventListener('keydown', e => { if (e.key === 'Enter') a.click(); });
});

/* Responsive: hamburger menu toggle */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('nav-links').classList.toggle('mobile-show');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  const navLinks = document.getElementById('nav-links');
  const hamburger = document.getElementById('hamburger');
  if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
    navLinks.classList.remove('mobile-show');
  }
});
