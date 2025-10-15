// Toggle mobile nav menu
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

    // --- One-time Dynamic Fade-Up + Scale Animation with Stagger ---
    const boxes = document.querySelectorAll('.service-box1');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = [...boxes].indexOf(entry.target);
          const delay = index * 200; // 200ms stagger per item

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          // Animate only once
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    boxes.forEach(box => observer.observe(box));

// Handle review form submission
  const form = document.getElementById("reviewForm");
  const msg = document.getElementById("formMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const response = await fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      msg.textContent = "✅ Thank you! Your review has been submitted.";
      msg.style.display = "block";
      form.reset();
    } else {
      msg.textContent = "⚠️ Sorry, something went wrong. Please try again.";
      msg.style.display = "block";
    }
  });

 