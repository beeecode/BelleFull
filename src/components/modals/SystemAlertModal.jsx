import { motion } from 'framer-motion';
import { Trash2, CheckCircle2, Settings2 } from 'lucide-react';

export function SystemAlertModal({ alert, onCancel, onConfirm }) {
  if (!alert) return null;
  const Icon = alert.type === 'danger' ? Trash2 : alert.type === 'success' ? CheckCircle2 : Settings2;

  return (
    <div className="admin-modal-overlay" role="dialog" aria-modal="true">
      <motion.article
        className="admin-system-alert"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
      >
        <span className={`admin-alert-icon is-${alert.type || 'info'}`}>
          <Icon size={24} strokeWidth={1.7} />
        </span>
        <h2>{alert.title}</h2>
        <p>{alert.message}</p>
        <div className="admin-alert-actions">
          {alert.onConfirm && (
            <button className="admin-outline-button" type="button" onClick={onCancel}>
              {alert.cancelLabel || 'Cancel'}
            </button>
          )}
          <button
            className={alert.type === 'danger' ? 'admin-outline-danger' : 'admin-primary-button'}
            type="button"
            onClick={onConfirm}
          >
            {alert.confirmLabel || 'OK'}
          </button>
        </div>
      </motion.article>
    </div>
  );
}
