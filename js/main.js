// Toggle mobile nav menu
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

    // --- (Welcome Section)One-time Dynamic Fade-Up + Scale Animation with Stagger ---
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

// --- Hero Section Animation ---
const heroText = document.querySelector('.hero-text');

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      heroText.classList.add('visible');
      heroObserver.unobserve(entry.target); // Animate once
    }
  });
}, { threshold: 0.3 });

if (heroText) heroObserver.observe(heroText);

// ===== UNIVERSAL FADE-IN ANIMATION FOR ALL SERVICE PARTS =====
document.addEventListener("DOMContentLoaded", () => {
  const serviceSection = document.querySelector(".services-section");
  if (!serviceSection) return;

  const parts = serviceSection.querySelectorAll(".service-part");

  // Fade-in for the first part (usually the heading/introduction)
  if (parts.length > 0) {
    setTimeout(() => {
      parts[0].classList.add("fade-in");
    }, 300);
  }

  // Scroll-triggered fade-ins for all parts (including the first if needed)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add a slight stagger for elegance
          entry.target.style.transitionDelay = `${index * 0.25}s`;
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  parts.forEach((part) => observer.observe(part));
});

// ✅ Supabase client setup
const supabaseUrl = 'https://ansfcahvbvzfrlgoxjvc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuc2ZjYWh2YnZ6ZnJsZ294anZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMTMwNDQsImV4cCI6MjA3Mzc4OTA0NH0.v7ivUsvaC57J3XdkbCu2jfynsg_N2_--V7Lbymx8HzE';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// ✅ Review form submission
const reviewForm = document.getElementById("reviewForm");
if (reviewForm) {
  reviewForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    const { data, error } = await supabaseClient
      .from('reviews')
      .insert([{ name, email, message, status: false }]);

    if (error) {
      alert('❌ Error submitting review — check console for details.');
      console.error("Supabase insert error:", error);
    } else {
      alert('✅ Review submitted successfully! Pending admin approval.');
      this.reset();
    }
  });
}

// ✅ Appointment form submission
const appointmentForm = document.getElementById("appointmentForm");

if (appointmentForm) {
  appointmentForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  console.log('Form submitted');  // Add this to check if the event triggers

  // Create FormData object
  const formData = new FormData(this);

  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const location = formData.get("location");
  const rawDate = formData.get("appointment-time"); // e.g. "2025-10-16T14:30"
  const message = formData.get("message");

  // Validate fields
  if (!name || !email || !phone || !location || !rawDate) {
    alert("⚠️ Please fill in all required fields.");
    return;
  }

  console.log("All fields are filled, inserting data...");  // Check before insert

  // Convert raw date to ISO timestamp
  const date = new Date(rawDate).toISOString(); // → "2025-10-16T14:30:00.000Z"

  // Insert into Supabase
  const { data, error } = await supabaseClient
    .from("appointments")
    .insert([{ name, email, phone, location, date, message }]);

  if (error) {
    console.error("❌ Error booking appointment:", error.message);
    alert("❌ Error booking appointment: " + error.message);
  } else {
    alert("✅ Appointment booked successfully!");
    this.reset();
  }
});
}

//checkbox ✅ 
  const checkbox = document.getElementById('termsCheckbox');
  const bookButton = document.getElementById('bookNow');

  checkbox.addEventListener('change', () => {
    bookButton.disabled = !checkbox.checked;
  });

  // Fade-in effect on page load
  window.addEventListener('load', () => {
    document.body.classList.add('fade-in');
  });

  // Fade-out effect when leaving the page
  document.querySelectorAll('a').forEach(link => {
    if (link.hostname === window.location.hostname && !link.href.includes('#')) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.href;
        document.body.style.opacity = 0;
        setTimeout(() => {
          window.location.href = target;
        }, 500);
      });
    }
  });
