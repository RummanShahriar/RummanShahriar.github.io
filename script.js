/* ====== Smooth center-scroll + active nav + reveal animations ====== */

// center a section vertically in viewport
function centerScrollTo(element, behavior='smooth') {
  if (!element) return;
  const elRect = element.getBoundingClientRect();
  const elHeight = elRect.height;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const targetScroll = window.scrollY + elRect.top - (viewportHeight / 2 - elHeight / 2);
  window.scrollTo({ top: Math.max(0, Math.round(targetScroll)), behavior });
}

/* NAV LINK CLICK HANDLING */
function bindNavClicks() {
  document.querySelectorAll('#nav-links a, .cta a, #scroll-about').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.dataset.target || (this.getAttribute('href')||'').replace('#','');
      if (!targetId) return;
      const targetEl = document.getElementById(targetId);
      if (!targetEl) {
        location.href = this.getAttribute('href');
        return;
      }
      // Close mobile nav if open
      const nav = document.getElementById('nav-links');
      if (nav.classList.contains('show')) {
        nav.classList.remove('show');
        const toggle = document.getElementById('mobile-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
      centerScrollTo(targetEl, 'smooth');
      history.replaceState(null, '', '#' + targetId);
      // move focus for accessibility after scrolling
      setTimeout(()=> targetEl.focus({preventScroll:true}), 600);
    });
  });
}

/* MOBILE TOGGLE */
function bindMobileToggle() {
  const toggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('nav-links');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const visible = nav.classList.toggle('show');
    toggle.setAttribute('aria-expanded', visible ? 'true' : 'false');
  });
  // close on outside click
  document.addEventListener('click', (ev) => {
    if (!nav.contains(ev.target) && !toggle.contains(ev.target)) {
      if (nav.classList.contains('show')) {
        nav.classList.remove('show');
        toggle.setAttribute('aria-expanded','false');
      }
    }
  });
}

/* Active nav detection: use IntersectionObserver near center */
function initActiveNavObserver() {
  const navLinks = Array.from(document.querySelectorAll('#nav-links a'));
  const sectionIds = navLinks.map(a => a.dataset.target || a.getAttribute('href').replace('#',''));
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  if (sections.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-45% 0px -45% 0px', // focus on center region
    threshold: 0
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const id = entry.target.id;
        const link = navLinks.find(a => (a.dataset.target || a.getAttribute('href').replace('#','')) === id);
        if (link) link.classList.add('active');
      }
    });
  }, observerOptions);

  sections.forEach(s => io.observe(s));
}

/* reveal animations and skill-bar animation */
function initRevealAndSkills() {
  const reveals = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');

        // animate skill bars if skills section included
        if (e.target.querySelectorAll) {
          const skillSpans = e.target.querySelectorAll('.bar span');
          if (skillSpans.length === 0) {
            // maybe the revealed element is the skills section itself
            const nested = e.target.closest('#skills');
            if (nested) {
              nested.querySelectorAll('.bar span').forEach(span => {
                const targetW = span.getAttribute('data-target') || '80%';
                setTimeout(()=> span.style.width = targetW, 120);
              });
            }
          } else {
            skillSpans.forEach(span => {
              const targetW = span.getAttribute('data-target') || '80%';
              setTimeout(()=> span.style.width = targetW, 120);
            });
          }
        }

        obs.unobserve(e.target);
      }
    });
  }, {root:null, rootMargin:'0px 0px -10% 0px', threshold: 0.08});

  reveals.forEach(r => revealObserver.observe(r));
}

/* Contact form: simple mailto fallback + client validation */
function bindContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const clearBtn = document.getElementById('clear-btn');

  if (!form) return;

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    status.textContent = '';
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill in all fields.';
      return;
    }

    // Basic email validation
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      return;
    }

    // If you have a backend endpoint, replace this with a fetch() to the endpoint.
    // For GitHub Pages (static), we fallback to mailto: so users can still contact you.
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailto = `mailto:rummanshahriarrumman@gmail.com?subject=${subject}&body=${body}`;

    status.textContent = 'Opening mail client…';
    // open mailto in new tab/window — user will need to send manually
    window.location.href = mailto;

    setTimeout(()=> {
      status.textContent = 'If your mail client did not open, you can email directly to rummanshahriarrumman@gmail.com';
      form.reset();
    }, 800);
  });

  if (clearBtn) clearBtn.addEventListener('click', () => {
    form.reset();
    status.textContent = '';
  });
}

/* Keyboard accessibility for nav links (Enter should activate) */
function addKeyboardNavSupport() {
  document.querySelectorAll('#nav-links a').forEach(a=>{
    a.addEventListener('keydown', e => { if (e.key === 'Enter') a.click(); });
  });
}

/* On load: wire everything and optionally center to hash */
window.addEventListener('load', () => {
  bindNavClicks();
  bindMobileToggle();
  bindContactForm();
  initActiveNavObserver();
  initRevealAndSkills();
  addKeyboardNavSupport();

  // If there's a hash (deep-link), center it
  if (location.hash) {
    const id = location.hash.replace('#','');
    const el = document.getElementById(id);
    if (el) {
      setTimeout(()=> centerScrollTo(el,'smooth'), 120);
    }
  }
});
