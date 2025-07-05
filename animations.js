// === animations.js ===

// Animate tab switches
function animateTabIn(id) {
  const el = document.getElementById(id);
  el.classList.remove("fade-in", "slide-up"); // reset
  void el.offsetWidth; // reflow trick
  el.classList.add("fade-in", "slide-up");
}

// Attach animations on tab switches
function switchTab(tab) {
  document.querySelectorAll(".tab-content").forEach(div => {
    div.classList.add("hidden");
  });
  const target = document.getElementById("tab-" + tab);
  target.classList.remove("hidden");
  animateTabIn("tab-" + tab);
}
