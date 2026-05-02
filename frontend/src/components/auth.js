/* ==========================================
   Vote Pilot — Auth Component
   Login & Registration with validation
   ========================================== */

let currentTab = 'login';
let onAuthSuccess = null;

/**
 * Show auth page. Returns a promise that resolves when user logs in.
 */
export function showAuthPage() {
  return new Promise((resolve) => {
    onAuthSuccess = resolve;

    // Check if already logged in
    const user = getStoredUser();
    if (user) { resolve(user); return; }

    renderAuth();
  });
}

function getStoredUser() {
  try {
    const u = localStorage.getItem('votepilot_user');
    return u ? JSON.parse(u) : null;
  } catch { return null; }
}

function storeUser(user) {
  localStorage.setItem('votepilot_user', JSON.stringify(user));
}

export function logoutUser() {
  localStorage.removeItem('votepilot_user');
}

export function getCurrentUser() {
  return getStoredUser();
}

function renderAuth() {
  const page = document.createElement('div');
  page.className = 'auth-page';
  page.id = 'auth-page';
  page.innerHTML = `
    <div class="auth-bg-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>
    <div class="auth-card">
      <div class="auth-logo">
        <div class="auth-logo-icon">🧭</div>
        <h2>Vote Pilot</h2>
        <p>Your step-by-step election guide</p>
      </div>

      <div class="auth-social-proof">
        <div class="user-avatars">
          <span style="background:var(--accent-primary)"></span>
          <span style="background:var(--accent-secondary)"></span>
          <span style="background:var(--accent-success)"></span>
        </div>
        <span>Join 10,000+ informed voters</span>
      </div>

      <div class="auth-tabs">
        <button class="auth-tab active" data-tab="login" id="tab-login">Sign In</button>
        <button class="auth-tab" data-tab="register" id="tab-register">Register</button>
      </div>

      <div class="auth-error" id="auth-error"></div>
      <div class="auth-success" id="auth-success"></div>

      <div id="auth-form-container"></div>


      <div class="auth-footer">
        By continuing, you agree to Vote Pilot's <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
      </div>
    </div>
  `;

  document.body.appendChild(page);

  // Bind tabs
  page.querySelector('#tab-login').addEventListener('click', () => switchTab('login'));
  page.querySelector('#tab-register').addEventListener('click', () => switchTab('register'));

  // Social auth

  switchTab('login');
}

function switchTab(tab) {
  currentTab = tab;
  const page = document.getElementById('auth-page');
  page.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  hideMessages();

  const container = document.getElementById('auth-form-container');

  if (tab === 'login') {
    container.innerHTML = `
      <form class="auth-form" id="login-form">
        <div class="auth-field">
          <label for="login-email">Email Address</label>
          <input type="email" id="login-email" placeholder="you@example.com" required />
          <span class="auth-field-icon"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span>
        </div>
        <div class="auth-field">
          <label for="login-password">Password</label>
          <input type="password" id="login-password" placeholder="Enter your password" required minlength="6" />
          <span class="auth-field-icon"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
          <button type="button" class="auth-pass-toggle" id="login-pass-toggle">👁️</button>
        </div>
        <div class="auth-checkbox-row">
          <label><input type="checkbox" checked /> Remember me</label>
          <a href="#" class="auth-forgot">Forgot password?</a>
        </div>
        <button type="submit" class="auth-submit">Sign In to Vote Pilot</button>
      </form>
    `;

    // Password toggle
    const toggle = container.querySelector('#login-pass-toggle');
    const passInput = container.querySelector('#login-password');
    toggle.addEventListener('click', () => {
      passInput.type = passInput.type === 'password' ? 'text' : 'password';
      toggle.textContent = passInput.type === 'password' ? '👁️' : '🙈';
    });

    container.querySelector('#login-form').addEventListener('submit', handleLogin);
  } else {
    container.innerHTML = `
      <form class="auth-form" id="register-form">
        <div class="auth-field">
          <label for="reg-name">Full Name</label>
          <input type="text" id="reg-name" placeholder="Alex Rivera" required />
          <span class="auth-field-icon"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
        </div>
        <div class="auth-field">
          <label for="reg-email">Email Address</label>
          <input type="email" id="reg-email" placeholder="you@example.com" required />
          <span class="auth-field-icon"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span>
        </div>
        <div class="auth-field">
          <label for="reg-state">Your State</label>
          <select id="reg-state" required>
            <option value="">Select your state...</option>
            <option>Andhra Pradesh</option><option>Arunachal Pradesh</option><option>Assam</option>
            <option>Bihar</option><option>Chhattisgarh</option><option>Goa</option>
            <option>Gujarat</option><option>Haryana</option><option>Himachal Pradesh</option>
            <option>Jharkhand</option><option>Karnataka</option><option>Kerala</option>
            <option>Madhya Pradesh</option><option>Maharashtra</option><option>Manipur</option>
            <option>Meghalaya</option><option>Mizoram</option><option>Nagaland</option>
            <option>Odisha</option><option>Punjab</option><option>Rajasthan</option>
            <option>Sikkim</option><option>Tamil Nadu</option><option>Telangana</option>
            <option>Tripura</option><option>Uttar Pradesh</option><option>Uttarakhand</option>
            <option>West Bengal</option>
            <option>Andaman and Nicobar Islands</option><option>Chandigarh</option>
            <option>Dadra and Nagar Haveli and Daman and Diu</option><option>Delhi</option>
            <option>Jammu and Kashmir</option><option>Ladakh</option>
            <option>Lakshadweep</option><option>Puducherry</option>
          </select>
          <span class="auth-field-icon"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
        </div>
        <div class="auth-field">
          <label for="reg-password">Password</label>
          <input type="password" id="reg-password" placeholder="Create a strong password" required minlength="6" />
          <span class="auth-field-icon"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
          <button type="button" class="auth-pass-toggle" id="reg-pass-toggle">👁️</button>
        </div>
        <div class="password-strength" id="pass-strength">
          <div class="strength-bar" id="str1"></div>
          <div class="strength-bar" id="str2"></div>
          <div class="strength-bar" id="str3"></div>
          <div class="strength-bar" id="str4"></div>
        </div>
        <div class="strength-label" id="strength-label"></div>
        <div class="auth-checkbox-row">
          <label><input type="checkbox" id="reg-agree" required /> I'm eligible to vote & agree to <a href="#" style="color:var(--accent-primary);">Terms</a></label>
        </div>
        <button type="submit" class="auth-submit">Create Account</button>
      </form>
      
      <div class="auth-divider"><span>or continue with</span></div>
      <div class="auth-social-buttons">
        <button class="auth-social-btn" id="auth-google">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </button>
      </div>
    `;

    // Bind Google button only in Register
    container.querySelector('#auth-google').addEventListener('click', () => handleSocialAuth('Google'));

    // Password toggle
    const toggle = container.querySelector('#reg-pass-toggle');
    const passInput = container.querySelector('#reg-password');
    toggle.addEventListener('click', () => {
      passInput.type = passInput.type === 'password' ? 'text' : 'password';
      toggle.textContent = passInput.type === 'password' ? '👁️' : '🙈';
    });

    // Password strength
    passInput.addEventListener('input', () => updatePasswordStrength(passInput.value));

    container.querySelector('#register-form').addEventListener('submit', handleRegister);
  }
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) { showError('Please fill in all fields.'); return; }

  const btn = e.target.querySelector('.auth-submit');
  btn.classList.add('loading');
  btn.textContent = 'Signing in...';

  setTimeout(() => {
    // Demo Mode: Accept any login for now
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const user = { name, email, state: 'National' };
    storeUser(user);
    closeAuth(user);
  }, 800);
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const state = document.getElementById('reg-state').value;
  const password = document.getElementById('reg-password').value;
  const agree = document.getElementById('reg-agree').checked;

  if (!name || !email || !state || !password) { showError('Please fill in all fields.'); return; }
  if (password.length < 6) { showError('Password must be at least 6 characters.'); return; }
  if (!agree) { showError('You must agree to the terms to continue.'); return; }

  const btn = e.target.querySelector('.auth-submit');
  btn.classList.add('loading');
  btn.textContent = 'Creating account...';

  setTimeout(() => {
    const user = { name, email, state };
    storeUser(user);
    closeAuth(user);
  }, 800);
}

function handleSocialAuth(provider) {
  const email = prompt(`Enter your ${provider} email:`, `yourname@${provider.toLowerCase()}.com`);
  if (!email) return;

  const name = email.split('@')[0].split(/[._]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const user = { name, email, state: 'California' };
  storeUser(user);
  closeAuth(user);
}

function closeAuth(user) {
  const page = document.getElementById('auth-page');
  if (page) {
    page.style.opacity = '0';
    page.style.transition = 'opacity 0.4s ease';
    setTimeout(() => page.remove(), 400);
  }
  if (onAuthSuccess) onAuthSuccess(user);
}

function showError(msg) {
  const el = document.getElementById('auth-error');
  el.textContent = msg;
  el.classList.add('show');
  document.getElementById('auth-success')?.classList.remove('show');
}

function hideMessages() {
  document.getElementById('auth-error')?.classList.remove('show');
  document.getElementById('auth-success')?.classList.remove('show');
}

function updatePasswordStrength(password) {
  const bars = [document.getElementById('str1'), document.getElementById('str2'), document.getElementById('str3'), document.getElementById('str4')];
  const label = document.getElementById('strength-label');
  if (!bars[0]) return;

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9!@#$%^&*]/.test(password)) score++;

  const levels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const classes = ['', 'weak', 'medium', 'medium', 'strong'];

  bars.forEach((bar, i) => {
    bar.className = 'strength-bar';
    if (i < score) bar.classList.add(classes[score]);
  });
  label.textContent = levels[score] || '';
}
