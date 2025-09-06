// Mobile nav toggle
const hambtn = document.getElementById("hambtn");
const siteNav = document.getElementById("site-nav");

if (hambtn) {
  hambtn.addEventListener("click", () => {
    siteNav.classList.toggle("open");
    const expanded = hambtn.getAttribute("aria-expanded") === "true";
    hambtn.setAttribute("aria-expanded", !expanded);
  });
}

// Smooth scroll with center alignment
function scrollToCenter(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const offset = window.scrollY + rect.top - (window.innerHeight/2 - rect.height/2);
  window.scrollTo({ top: offset, behavior: "smooth" });
}

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const id = link.getAttribute("href").replace("#","");
    scrollToCenter(id);
    siteNav.classList.remove("open");
    hambtn.setAttribute("aria-expanded","false");
  });
});

// Active nav link with IntersectionObserver
const navLinks = document.querySelectorAll(".nav-link");
const sections = Array.from(navLinks).map(l => document.getElementById(l.getAttribute("href").replace("#","")));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove("active"));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add("active");
    }
  });
}, { root: null, rootMargin: "-45% 0px -45% 0px", threshold: 0 });

sections.forEach(sec => sec && observer.observe(sec));
