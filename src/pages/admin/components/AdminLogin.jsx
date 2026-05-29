import { useState } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../../../components/common/Logo';

export default function AdminLogin({ onLogin, showNotice }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      setError('Enter your email or username and password.');
      return;
    }
    setError('');
    onLogin(form.email, form.password);
  };

  return (
    <main className="admin-login-page">
      <motion.form
        className="admin-login-card"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Logo className="admin-login-logo" />
        <div>
          <h1>Admin Login</h1>
          <p>Mock development login for managing restaurant orders and menu</p>
        </div>
        <label className="admin-form-field">
          <span>Email or Username</span>
          <input
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="Enter email or username"
          />
        </label>
        <label className="admin-form-field">
          <span>Password</span>
          <input
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder="Enter password"
            type="password"
          />
        </label>
        {error && <p className="admin-error-text">{error}</p>}
        <button className="admin-primary-button" type="submit">
          Login
        </button>
        <button
          className="admin-link-button"
          type="button"
          onClick={() =>
            showNotice(
              'Password Reset',
              'Password reset flow will be connected with the backend later.'
            )
          }
        >
          Forgot password?
        </button>
      </motion.form>
    </main>
  );
}
