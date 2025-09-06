// Navbar toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Active link on scroll
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-link");

function scrollActive() {
  let scrollY = window.pageYOffset + 80; // offset for navbar
  sections.forEach(current => {
    const sectionTop = current.offsetTop;
    const sectionHeight = current.offsetHeight;
    const sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document.querySelector(`.nav-link[href*=${sectionId}]`).classList.add("active");
    } else {
      document.querySelector(`.nav-link[href*=${sectionId}]`).classList.remove("active");
    }
  });
}
window.addEventListener("scroll", scrollActive);

// Smooth scroll
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    window.scrollTo({
      top: target.offsetTop - 60, // offset for navbar
      behavior: 'smooth'
    });
  });
});
