/* script.js
   - centered anchor scroll
   - active nav via IntersectionObserver (center focus)
   - reveal animations
   - pdf modal open/close
   - mobile nav toggle
   - contact form demo send
*/

(function(){
  /** Center a section vertically */
  function centerScrollTo(el, smooth = true) {
    if(!el) return;
    const rect = el.getBoundingClientRect();
    const elH = rect.height;
    const viewportH = window.innerHeight;
    const top = window.scrollY + rect.top - (viewportH/2 - elH/2);
    window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: smooth ? 'smooth' : 'auto' });
  }

  /* NAV link clicks */
  document.querySelectorAll('.nav-link, .brand-name, #hero-about').forEach(node=>{
    node.addEventListener('click', (e)=>{
      e.preventDefault();
      const id = node.dataset.target || (node.getAttribute('href') || '').replace('#','');
      if(!id) return;
      const el = document.getElementById(id);
      if(el) {
        centerScrollTo(el, true);
        history.replaceState(null, '', '#'+id);
        // close mobile nav if open
        closeMobileNav();
      }
    });
  });

  /* Mobile nav toggle */
  const hambtn = document.getElementById('hambtn');
  const siteNav = document.getElementById('site-nav');
  hambtn && hambtn.addEventListener('click', ()=>{
    const expanded = hambtn.getAttribute('aria-expanded') === 'true';
    hambtn.setAttribute('aria-expanded', (!expanded).toString());
    siteNav.classList.toggle('open');
    hambtn.classList.toggle('open');
  });

  function closeMobileNav(){
    if(siteNav.classList.contains('open')){
      siteNav.classList.remove('open');
      hambtn.setAttribute('aria-expanded','false');
      hambtn.classList.remove('open');
    }
  }

  /* Active nav - IntersectionObserver focusing center region */
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const ids = navLinks.map(a => a.dataset.target || a.getAttribute('href').replace('#',''));
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);

  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        navLinks.forEach(a => a.classList.remove('active'));
        const id = entry.target.id;
        const link = navLinks.find(a => (a.dataset.target || a.getAttribute('href').replace('#','')) === id);
        if(link) link.classList.add('active');
      }
    });
  }, {
    root:null,
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0
  });

  sections.forEach(s=> observer.observe(s));

  /* Reveal animations */
  const reveals = document.querySelectorAll('[data-reveal]');
  const revealObs = new IntersectionObserver((ents, obs) => {
    ents.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('revealed');
        // trigger skill badge animation (ring glow) when skills revealed
        if(e.target.closest('#skills')){
          document.querySelectorAll('.skill-badge .ring').forEach((r,i)=>{
            // small staged animation delay
            setTimeout(()=> r.style.transform = 'scale(1.03)', i*80);
            setTimeout(()=> r.style.transform = 'none', 650 + i*40);
          });
        }
        obs.unobserve(e.target);
      }
    });
  }, {root:null, rootMargin:'0px 0px -10% 0px', threshold:0.06});
  reveals.forEach(r => revealObs.observe(r));

  /* PDF modal */
  const pdfModal = document.getElementById('pdf-modal');
  const pdfBackdrop = document.getElementById('pdf-backdrop');
  const pdfFrame = document.getElementById('pdf-frame');
  const pdfClose = document.getElementById('pdf-close');

  function openPdf(url){
    if(!url) return;
    pdfFrame.src = url;
    pdfModal.classList.add('show');
    pdfModal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closePdf(){
    pdfModal.classList.remove('show');
    pdfModal.setAttribute('aria-hidden','true');
    pdfFrame.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-pdf').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      const pdf = btn.getAttribute('data-pdf');
      openPdf(pdf);
    });
  });
  pdfBackdrop.addEventListener('click', closePdf);
  pdfClose.addEventListener('click', closePdf);
  document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') closePdf(); });

  /* contact form demo send */
  const contactForm = document.getElementById('contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', (ev)=>{
      ev.preventDefault();
      const status = document.getElementById('form-status');
      status.textContent = 'Sending…';
      setTimeout(()=> {
        status.textContent = 'Message sent — thank you! I will reply within 2 business days.';
        contactForm.reset();
      }, 800);
    });
  }

  /* center on load if hash present */
  window.addEventListener('load', ()=>{
    const id = location.hash.replace('#','');
    if(id){
      const el = document.getElementById(id);
      if(el) setTimeout(()=> centerScrollTo(el,true), 120);
    }
  });

  /* ensure active link updates on manual scroll end (fallback) */
  let scrollTimeout;
  window.addEventListener('scroll', ()=>{
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(()=> {
      // nothing extra needed here because IntersectionObserver handles active nav,
      // but we ensure mobile nav closes after scroll on small screens
      if(window.innerWidth < 960) closeMobileNav();
    }, 120);
  });

  /* accessibility: allow Enter on brand to go home */
  document.querySelector('.brand').addEventListener('keydown', e=>{
    if(e.key === 'Enter') {
      const home = document.getElementById('hero');
      centerScrollTo(home, true);
    }
  });

})();
