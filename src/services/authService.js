/**
 * Authentication service handling admin login and logout flow.
 * Once connected to the backend, these functions will call actual REST APIs (e.g., /api/auth/login).
 */

export const authService = {
  /**
   * Log in the admin user.
   * @param {string} email - Email or username
   * @param {string} password - Password
   * @returns {Promise<boolean>}
   */
  async login(email, password) {
    return new Promise((resolve, reject) => {
      // Simulate API latency
      setTimeout(() => {
        if (!email.trim() || !password.trim()) {
          reject(new Error('Enter your email or username and password.'));
        } else {
          window.localStorage.setItem('amazingTasteAdmin', 'active');
          resolve(true);
        }
      }, 500);
    });
  },

  /**
   * Log out the admin user.
   * @returns {Promise<boolean>}
   */
  async logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        window.localStorage.removeItem('amazingTasteAdmin');
        resolve(true);
      }, 300);
    });
  },

  /**
   * Check if user is currently authenticated.
   * @returns {boolean}
   */
  isAuthenticated() {
    return window.localStorage.getItem('amazingTasteAdmin') === 'active';
  },
};
