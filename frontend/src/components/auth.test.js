import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { showAuthPage } from './auth.js';

describe('Auth Component', () => {
  afterEach(() => {
    // Cleanup DOM
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('should render the login form by default', () => {
    showAuthPage();
    const loginForm = document.getElementById('login-form');
    expect(loginForm).not.toBeNull();
    const emailInput = document.getElementById('login-email');
    expect(emailInput).not.toBeNull();
  });

  it('should switch to register tab when clicked', () => {
    showAuthPage();
    const registerTab = document.getElementById('tab-register');
    
    // Simulate click
    registerTab.click();
    
    const registerForm = document.getElementById('register-form');
    expect(registerForm).not.toBeNull();
    const nameInput = document.getElementById('reg-name');
    expect(nameInput).not.toBeNull();
  });
});
