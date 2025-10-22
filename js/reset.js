// --- Supabase Configuration ---
const supabaseUrl = 'https://ansfcahvbvzfrlgoxjvc.supabase.co';
const supabaseAnonKey = 'YOUR_REAL_ANON_KEY_HERE'; // replace with the full correct key
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// --- Toggle Password Visibility ---
function togglePassword(id, el) {
  const input = document.getElementById(id);
  const icon = el.querySelector("i");
  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  }
}

// --- Handle Password Reset ---
document.getElementById("resetButton").addEventListener("click", async () => {
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (!newPassword || !confirmPassword) {
    alert("Please fill in both fields.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      console.error("Error updating password:", error);
      alert(error.message);
    } else {
      alert("✅ Password updated successfully!");
      window.location.href = "admin.html";
    }
  } catch (err) {
    console.error(err);
    alert("Unexpected error. Please try again.");
  }
});