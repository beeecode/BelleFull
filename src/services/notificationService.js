import { initialMessages } from '../data/messages';

const MESSAGES_KEY = 'atd_admin_messages';

const readMessages = () => {
  try {
    const stored = window.localStorage.getItem(MESSAGES_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Fall through to mock seed data.
  }

  window.localStorage.setItem(MESSAGES_KEY, JSON.stringify(initialMessages));
  return initialMessages;
};

const writeMessages = (messages) => {
  window.localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
};

export const notificationService = {
  async list() {
    return readMessages();
  },

  async delete(messageId) {
    const messages = readMessages().filter((message) => message.id !== messageId);
    writeMessages(messages);
    return true;
  },

  async markAsRead(messageId) {
    const messages = readMessages().map((message) =>
      message.id === messageId ? { ...message, read: true } : message,
    );
    writeMessages(messages);
    return true;
  },
};
