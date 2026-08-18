// Grab every element on the page that has the class "reveal"
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12 
});

revealEls.forEach(function(el) {
  io.observe(el);
});