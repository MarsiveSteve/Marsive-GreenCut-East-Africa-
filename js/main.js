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


  // Supabase client setup
   const supabaseUrl = 'https://ansfcahvbvzfrlgoxjvc.supabase.co'; // Your Supabase URL
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuc2ZjYWh2YnZ6ZnJsZ294anZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMTMwNDQsImV4cCI6MjA3Mzc4OTA0NH0.v7ivUsvaC57J3XdkbCu2jfynsg_N2_--V7Lbymx8HzE'; // Your Supabase Anon Key
  const supabase = supabase.createClient(supabaseUrl, supabaseKey);

  document.getElementById("reviewForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    // Insert review into Supabase
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ name, email, message, status: false }]); // status = false (pending approval)

    if (error) {
      alert('Error submitting review');
      console.error(error);
    } else {
      alert('Review submitted successfully! It is pending approval.');
      this.reset();
    }
  });

// Appointment booking logic
  function bookAppointment() {
  const datetime = document.getElementById("appointment-time").value;
  if (!datetime) {
    alert("Please select a date and time for your appointment.");
    return;
  }

  // Simulate booking logic
  alert(`Appointment booked for: ${new Date(datetime).toLocaleString()}`);
}

 