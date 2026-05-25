import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';

export function ChangePasswordModal({ isOpen, onClose, onSave }) {
  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave();
    onClose();
  };

  return (
    <div className="admin-modal-overlay" role="dialog" aria-modal="true">
      <motion.form
        className="admin-details-modal admin-edit-modal"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
      >
        <button className="admin-modal-close" type="button" onClick={onClose} aria-label="Close change password">
          <X size={20} />
        </button>
        <h2>Change Password</h2>
        <label className="admin-form-field">
          <span>Current password</span>
          <input type="password" required />
        </label>
        <label className="admin-form-field">
          <span>New password</span>
          <input type="password" required />
        </label>
        <button className="admin-primary-button" type="submit">
          <Save size={15} strokeWidth={1.8} aria-hidden="true" />
          Save Password
        </button>
      </motion.form>
    </div>
  );
}
