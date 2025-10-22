// ---------- Supabase Client ----------
const supabaseUrl = 'https://ansfcahvbvzfrlgoxjvc.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuc2ZjYWh2YnZ6ZnJsZ294anZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMTMwNDQsImV4cCI6MjA3Mzc4OTA0NH0.v7ivUsvaC57J3XdkbCu2jfynsg_N2_--V7Lbymx8HzE';
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// ---------- UI Elements ----------
const modal = document.getElementById('authModal');
const authTitle = document.getElementById('authTitle');
const authSubtitle = document.getElementById('authSubtitle');
const nameInput = document.getElementById('name');
const confirmField = document.getElementById('confirmField');
const authButton = document.getElementById('authButton');
const loginBox = document.getElementById('loginBox');
const signupBox = document.getElementById('signupBox');
const dashboardSection = document.getElementById('dashboardSection');
const userEmailEl = document.getElementById('userEmail');
const userRoleEl = document.getElementById('userRole');

let isSignup = false;

// ---------- Modal Controls ----------
function openModal() {
  modal.style.display = 'flex';
}

function closeModal() {
  modal.style.display = 'none';
}

// ---------- Switch Login / Signup ----------
function switchToSignup() {
  isSignup = true;
  authTitle.textContent = 'Create Account';
  authSubtitle.textContent = 'Sign up to access the dashboard';
  nameInput.style.display = 'block';
  confirmField.style.display = 'flex';
  authButton.textContent = 'Sign Up';
  loginBox.style.display = 'none';
  signupBox.style.display = 'block';
}

function switchToLogin() {
  isSignup = false;
  authTitle.textContent = 'Welcome Back';
  authSubtitle.textContent = 'Please log in to continue';
  nameInput.style.display = 'none';
  confirmField.style.display = 'none';
  authButton.textContent = 'Login';
  loginBox.style.display = 'block';
  signupBox.style.display = 'none';
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

// ---------- Handle Auth ----------
async function handleAuth() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const name = document.getElementById('name').value.trim();
  const redirectUrl = document.getElementById('redirectUrl').value;

  if (!email || !password) {
    alert('Please fill all fields.');
    return;
  }

  if (isSignup) {
    const confirmPassword = document.getElementById('confirmPasswordAuth').value;
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert('✅ Signup successful! Please check your email to confirm your account.');
    switchToLogin();
  } else {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert('✅ Login successful!');
    closeModal();
    showDashboard(data.user);
  }
}

// ---------- Dashboard Display ----------
function showDashboard(user) {
  if (!user) return;

  document.getElementById('openAuthBtn').style.display = 'none';
  dashboardSection.style.display = 'block';
  userEmailEl.textContent = user.email;
  userRoleEl.textContent = user.app_metadata?.role || 'user';

  fetchReviews();
}

// ---------- Logout ----------
async function logout() {
  await supabase.auth.signOut();
  alert('Logged out.');
  location.reload();
}

// ---------- Reset Password ----------
async function resetPassword() {
  const email = prompt('Enter your email to reset password:');
  if (!email) return;

  const redirectUrl = document.getElementById('redirectUrl').value;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl + 'reset.html',
  });

  if (error) alert(error.message);
  else alert('📩 Password reset email sent!');
}

// ---------- Reviews Fetch & Update ----------
async function fetchReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return;
  }

  displayReviews(data);
}

function displayReviews(reviews) {
  const tableBody = document.querySelector('#reviewsTable tbody');
  tableBody.innerHTML = '';

  reviews.forEach((review) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${review.name}</td>
      <td>${review.email}</td>
      <td>${review.message}</td>
      <td>${review.status ? '✅ Approved' : '🕓 Pending'}</td>
      <td>
        <button class="approve" onclick="approveReview(${review.id})">Approve</button>
        <button class="reject" onclick="rejectReview(${review.id})">Reject</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

async function updateReviewStatus(id, status) {
  try {
    const response = await fetch(
      'https://ansfcahvbvzfrlgoxjvc.supabase.co/functions/v1/update-review',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {
      alert(status ? '✅ Review approved!' : '❌ Review rejected!');
      fetchReviews();
    } else {
      alert('Error updating review.');
      console.error(result);
    }
  } catch (err) {
    console.error('Error calling edge function:', err);
    alert('Server error — check console.');
  }
}

function approveReview(id) {
  updateReviewStatus(id, true);
}

function rejectReview(id) {
  updateReviewStatus(id, false);
}

// ---------- Load Reviews on Start ----------
window.onload = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.user) showDashboard(session.user);
};