// Toggle mobile nav menu
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

const text = "Comprehensive Lawn Care"; // The text to type out
let i = 0;
function typeText() {
  if (i < text.length) {
    document.getElementById("typing-effect").textContent += text.charAt(i); // Add one character at a time
    i++;
    setTimeout(typeText, 100); // Call this function again after 100ms
  }
}
typeText(); // Start typing the text