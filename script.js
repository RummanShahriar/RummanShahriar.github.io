/* Responsive nav toggle, anchor scrolling to TOP of section under navbar,
   robust active-link logic (based on element top vs nav height),
   reveal animation trigger, pdf preview fallback, and skill bar animation. */

(() => {
  const header = document.getElementById('site-header');
  const nav = document.getElementById('site-nav');
  const hambtn = document.getElementById('hambtn');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map(a => document.getElementById(a.getAttribute('data-target')))
    .filter(Boolean);

  /* Mobile nav toggle */
  hambtn && hambtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    hambtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* Utility: get header height */
  function headerHeight() {
    return header ? header.getBoundingClientRect().height : 72;
  }

  /* Smooth scroll so section top sits right below navbar */
  function scrollToSectionTop(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = headerHeight() + 12; // 12px breathing room
    const target = window.scrollY + el.getBoundingClientRect().top - offset;
    window.scrollTo({ top: Math.max(0, Math.round(target)), behavior: 'smooth' });
  }

  /* Attach click on nav links */
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('data-target');
      scrollToSectionTop(id);
      // close mobile nav if open
      if (nav.classList.contains('open')) {
        nav.classList.remove('open');
        hambtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* When brand clicked - go home (top of hero) */
  document.querySelector('.brand').addEventListener('click', () => scrollToSectionTop('hero'));
  document.querySelector('#jump-about').addEventListener('click', (e) => {
    e.preventDefault(); scrollToSectionTop('about');
  });

  /* Active link detection based on element.top relative to header height:
     Choose the section whose top <= headerHeight + 20 and bottom > headerHeight + 20 */
  let ticking = false;
  function updateActiveOnScroll() {
    const navH = headerHeight();
    const margin = 18; // small tolerance
    let found = null;
    for (const sec of sections) {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= navH + margin && rect.bottom > navH + margin) {
        found = sec.id;
        break;
      }
    }
    // fallback: if none found, choose the first section whose top > navH (user scrolled above all sections)
    if (!found) {
      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top > navH + margin) { found = sec.id; break; }
      }
    }
    // final fallback: last section
    if (!found && sections.length) found = sections[sections.length - 1].id;

    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('data-target') === found));
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // run once on load
  window.addEventListener('load', () => {
    // if hash present, scroll properly (top of section under nav)
    if (location.hash) {
      const id = location.hash.replace('#','');
      setTimeout(()=> scrollToSectionTop(id), 80);
    }
    updateActiveOnScroll();
    // animate skill bars when skills in view
    triggerReveal();
  });

  /* Reveal animation and skill bar animation */
  const revealNodes = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // animate any skill fills in this section
        const fills = entry.target.querySelectorAll('.fill');
        fills.forEach((f, i) => {
          const targetW = f.style.width || f.getAttribute('data-w') || '80%';
          setTimeout(()=> f.style.width = targetW, i * 60);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
  revealNodes.forEach(n => revealObserver.observe(n));

  function triggerReveal() {
    revealNodes.forEach(n => {
      const rect = n.getBoundingClientRect();
      if (rect.top < window.innerHeight) n.classList.add('revealed');
    });
    // also animate any pre-rendered fills
    document.querySelectorAll('.fill').forEach(f => {
      const w = f.style.width || f.getAttribute('data-w');
      if (w) f.style.width = w;
    });
  }

  /* PDF preview modal (if you add buttons to open preview) */
  const pdfModal = document.getElementById('pdf-modal');
  const pdfFrame = document.getElementById('pdf-frame');
  const pdfClose = document.getElementById('pdf-close');
  document.querySelectorAll('.open-pdf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const url = btn.getAttribute('data-pdf');
      if (!url) return;
      pdfFrame.src = url;
      pdfModal.classList.add('show');
      pdfModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });
  if (pdfClose) pdfClose.addEventListener('click', closePdf);
  document.querySelectorAll('.pdf-backdrop, .pdf-close').forEach(n => n && n.addEventListener('click', closePdf));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePdf(); });
  function closePdf(){ if (!pdfModal) return; pdfModal.classList.remove('show'); pdfFrame.src = ''; pdfModal.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }

  /* ensure nav active updates on resize (header height changes) */
  window.addEventListener('resize', () => {
    updateActiveOnScroll();
  });

})();
