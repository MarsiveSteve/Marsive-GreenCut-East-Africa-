// Simple interactivity
document.addEventListener("DOMContentLoaded", () => {
  const bookBtn = document.querySelector(".btn");
  if (bookBtn) {
    bookBtn.addEventListener("click", () => {
      alert("Redirecting to booking services...");
    });
  }
});
