import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, LogOut, Upload, Save } from 'lucide-react';
import { ChangePasswordModal } from '../../../components/modals/ChangePasswordModal';

const itemVariants = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] } },
};

export default function SettingsTab({ settings, setSettings, onLogout, showNotice }) {
  const [passwordOpen, setPasswordOpen] = useState(false);

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  return (
    <>
      <motion.div className="admin-list-heading" variants={itemVariants}>
        <h1>Settings</h1>
      </motion.div>
      <div className="admin-settings-card">
        {Object.entries(settings).map(([key, value]) => (
          <label className="admin-form-field" key={key}>
            <span>{key.replace(/([A-Z])/g, ' $1')}</span>
            <input
              value={value || ''}
              onChange={(event) => updateSetting(key, event.target.value)}
              placeholder={key}
            />
          </label>
        ))}
        <label className="admin-upload-field admin-logo-upload">
          <span>Logo upload</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={() => showNotice('Logo Selected', 'Logo upload is ready for backend connection.')}
          />
          <div className="admin-upload-box">
            <Upload size={24} />
            <strong>Choose logo file</strong>
            <small>PNG, JPG, or WEBP supported</small>
          </div>
        </label>
        <button className="admin-primary-button" type="button" onClick={() => setPasswordOpen(true)}>
          <Lock size={15} strokeWidth={1.8} aria-hidden="true" />
          Change Password
        </button>
        <button className="admin-outline-danger" type="button" onClick={onLogout}>
          <LogOut size={15} strokeWidth={1.8} aria-hidden="true" />
          Logout
        </button>
      </div>
      <ChangePasswordModal
        isOpen={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        onSave={() => showNotice('Password Updated', 'Password changed locally for the mock admin flow.')}
      />
    </>
  );
}
