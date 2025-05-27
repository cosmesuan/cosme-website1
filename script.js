let currentTab = 'login';

function switchTab(tab, event) {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  if (tab === 'login') {
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  } else {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
  }
  currentTab = tab;
  clearAlerts();
}

function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    button.textContent = '🙈';
  } else {
    input.type = 'password';
    button.textContent = '👁️';
  }
}

function analyzePassword() {
  const password = document.getElementById('signup-password').value;
  const strengthContainer = document.getElementById('password-strength');
  const strengthFill = document.getElementById('strength-fill');
  const strengthFeedback = document.getElementById('strength-feedback');
  if (password.length === 0) {
    strengthContainer.classList.add('hidden');
    return;
  }
  strengthContainer.classList.remove('hidden');
  let score = 0, feedback = '', crackTime = '', color = '';
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 15;
  if (/(.)\1{2,}/.test(password)) score -= 10;
  if (/123|abc|qwe|password|admin/i.test(password)) score -= 20;
  if (score < 30) { feedback = 'Very Weak - Easily Crackable'; crackTime = '< 1 second'; color = '#dc3545'; }
  else if (score < 50) { feedback = 'Weak - Could be cracked quickly'; crackTime = '< 1 minute'; color = '#fd7e14'; }
  else if (score < 70) { feedback = 'Fair - Moderate security'; crackTime = '~ 1 hour'; color = '#ffc107'; }
  else if (score < 85) { feedback = 'Good - Hard to crack'; crackTime = '~ 1 year'; color = '#17a2b8'; }
  else { feedback = 'Excellent - Very secure'; crackTime = '> 100 years'; color = '#28a745'; }
  const finalScore = Math.max(0, Math.min(100, score));
  strengthFill.style.width = finalScore + '%';
  strengthFill.style.backgroundColor = color;
  strengthFeedback.style.backgroundColor = color;
  strengthFeedback.innerHTML = `<div>${feedback}</div><div>Estimated crack time: ${crackTime}</div>`;
  updateRequirements(password);
}

function updateRequirements(password) {
  const requirements = [
    { id: 'req-length', test: password.length >= 8 },
    { id: 'req-upper', test: /[A-Z]/.test(password) },
    { id: 'req-lower', test: /[a-z]/.test(password) },
    { id: 'req-number', test: /[0-9]/.test(password) },
    { id: 'req-special', test: /[^A-Za-z0-9]/.test(password) }
  ];
  requirements.forEach(req => {
    const element = document.getElementById(req.id);
    if (req.test) element.classList.add('valid');
    else element.classList.remove('valid');
  });
}

function checkPasswordMatch() {
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const matchElement = document.getElementById('password-match');
  if (confirmPassword.length === 0) {
    matchElement.classList.add('hidden');
    return;
  }
  matchElement.classList.remove('hidden');
  if (password === confirmPassword) {
    matchElement.textContent = '✓ Passwords match';
    matchElement.classList.add('valid');
  } else {
    matchElement.textContent = '✗ Passwords do not match';
    matchElement.classList.remove('valid');
  }
}

function showAlert(message, type) {
  const alertContainer = document.getElementById('alert-container');
  const icon = type === 'success' ? '✅' : '❌';
  alertContainer.innerHTML = `<div class="alert ${type}"><span>${icon}</span><span>${message}</span></div>`;
}

function clearAlerts() {
  document.getElementById('alert-container').innerHTML = '';
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  if (!email || !password) {
    showAlert('Please fill in all fields', 'error');
    return;
  }
  try {
    const submitBtn = event.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing in...';
    submitBtn.disabled = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'user@example.com' && password === 'password123') {
      showAlert('Login successful! Welcome back.', 'success');
      document.getElementById('login-email').value = '';
      document.getElementById('login-password').value = '';
    } else {
      showAlert('Invalid email or password', 'error');
    }
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  } catch (error) {
    showAlert('Login failed. Please try again.', 'error');
  }
}

async function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  if (!name || !email || !password || !confirmPassword) {
    showAlert('Please fill in all fields', 'error');
    return;
  }
  if (password !== confirmPassword) {
    showAlert('Passwords do not match', 'error');
    return;
  }
  const strengthFill = document.getElementById('strength-fill');
  const currentWidth = parseInt(strengthFill.style.width) || 0;
  if (currentWidth < 50) {
    showAlert('Please choose a stronger password', 'error');
    return;
  }
  try {
    const submitBtn = event.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;
    await new Promise(resolve => setTimeout(resolve, 1500));
    showAlert('Account created successfully! You can now log in.', 'success');
    document.getElementById('signup-name').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('confirm-password').value = '';
    document.getElementById('password-strength').classList.add('hidden');
    document.getElementById('password-match').classList.add('hidden');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  } catch (error) {
    showAlert('Signup failed. Please try again.', 'error');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('login-email').focus();
});

