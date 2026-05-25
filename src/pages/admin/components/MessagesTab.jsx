import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Check, Trash2, X } from 'lucide-react';

const itemVariants = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] } },
};

function DetailRow({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value || '-'}</strong>
    </div>
  );
}

export default function MessagesTab({ messages, setMessages, requestConfirm }) {
  const [selectedMessage, setSelectedMessage] = useState(null);

  const deleteMessage = (id) => {
    requestConfirm({
      title: 'Delete Message?',
      message: 'Are you sure you want to delete this message? This action cannot be undone.',
      confirmLabel: 'Delete',
      onConfirm: () => setMessages((current) => current.filter((message) => message.id !== id)),
    });
  };

  const handleMarkAsRead = (id) => {
    setMessages((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  return (
    <>
      <motion.div className="admin-list-heading" variants={itemVariants}>
        <h1>Messages</h1>
      </motion.div>
      <div className="admin-simple-grid">
        {messages.map((message) => (
          <article className="admin-message-card" key={message.id}>
            <header>
              <strong>{message.name}</strong>
              <span className={message.read ? 'is-available' : 'is-unavailable'}>
                {message.read ? 'Read' : 'Unread'}
              </span>
            </header>
            <p>{message.contact}</p>
            <h3>{message.subject}</h3>
            <p>{message.content}</p>
            <footer>
              <span>{message.date}</span>
              <button type="button" onClick={() => setSelectedMessage(message)}>
                <Eye size={15} strokeWidth={1.8} aria-hidden="true" />
                View
              </button>
              <button type="button" onClick={() => handleMarkAsRead(message.id)}>
                <Check size={15} strokeWidth={1.8} aria-hidden="true" />
                Mark as read
              </button>
              <button type="button" onClick={() => deleteMessage(message.id)}>
                <Trash2 size={15} strokeWidth={1.8} aria-hidden="true" />
                Delete
              </button>
            </footer>
          </article>
        ))}
      </div>
      {selectedMessage && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true">
          <article className="admin-details-modal">
            <button
              className="admin-modal-close"
              type="button"
              onClick={() => setSelectedMessage(null)}
              aria-label="Close message details"
            >
              <X size={20} />
            </button>
            <h2>{selectedMessage.subject}</h2>
            <p>
              {selectedMessage.name} - {selectedMessage.contact}
            </p>
            <div className="admin-detail-panel">
              <p>{selectedMessage.content}</p>
              <DetailRow label="Date" value={selectedMessage.date} />
              <DetailRow label="Status" value={selectedMessage.read ? 'Read' : 'Unread'} />
            </div>
            <button
              className="admin-primary-button"
              type="button"
              onClick={() => {
                handleMarkAsRead(selectedMessage.id);
                setSelectedMessage(null);
              }}
            >
              <Check size={15} strokeWidth={1.8} aria-hidden="true" />
              Mark as read
            </button>
          </article>
        </div>
      )}
    </>
  );
}
