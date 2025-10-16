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

// ✅ Supabase client setup
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

    const formData = new FormData(this);
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const location = formData.get("location");
    const date = formData.get("appointment-time");
    const message = formData.get("message");

    if (!name || !email || !phone || !location || !date) {
      alert("⚠️ Please fill in all required fields.");
      return;
    }

    const { data, error } = await supabaseClient.from("appointments").insert([
      { name, email, phone, location, date, message }
    ]);

    if (error) {
      console.error("❌ Error booking appointment:", error.message);
      alert("❌ Error booking appointment: " + error.message);
    } else {
      alert("✅ Appointment booked successfully!");
      this.reset();
    }
  });
}

// ✅ Scroll + animation logic (optional UI enhancement)
document.addEventListener('DOMContentLoaded', function () {
  const section = document.querySelector('.appointment-section');
  if (section) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          section.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    observer.observe(section);
  }

  // Make hover effect persist on click
  document.querySelectorAll('.form-container button').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('stay-hover');
    });
  });
});
