// ---------- Supabase Client ----------
const supabaseUrl = 'https://ansfcahvbvzfrlgoxjvc.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuc2ZjYWh2YnZ6ZnJsZ294anZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMTMwNDQsImV4cCI6MjA3Mzc4OTA0NH0.v7ivUsvaC57J3XdkbCu2jfynsg_N2_--V7Lbymx8HzE';
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// ---------- Detect Recovery Session ----------
async function initResetSession() {
  const hash = window.location.hash;
  if (!hash.includes('access_token')) {
    console.error('No access token found in URL.');
    return;
  }

  // Parse the URL fragment
  const params = new URLSearchParams(hash.substring(1));
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (!accessToken || !refreshToken) {
    alert('Invalid or missing reset session.');
    return;
  }

  // Create Supabase session
  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) {
    console.error('Session setup error:', error.message);
    alert('Auth session missing or invalid. Try clicking the reset link again.');
  } else {
    console.log('Session restored for:', data.user?.email);
  }
}

// ---------- Password Toggle ----------
function togglePassword(id, el) {
  const input = document.getElementById(id);
  const icon = el.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  }
}

// ---------- Handle Password Update ----------
async function handlePasswordReset() {
  const newPassword = document.getElementById('newPassword').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();

  if (!newPassword || !confirmPassword) {
    alert('Please fill in both fields.');
    return;
  }

  if (newPassword !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    alert('Error updating password: ' + error.message);
  } else {
    alert('✅ Password updated successfully!');
    window.location.href = 'admin.html'; // redirect back to login
  }
}

// ---------- Event Listeners ----------
document.getElementById('resetButton').addEventListener('click', handlePasswordReset);

// Initialize the session on page load
initResetSession();