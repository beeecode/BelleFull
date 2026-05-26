import { initialMessages } from '../data/messages';
import {
  deleteMockCategory,
  deleteMockProduct,
  getMockCategories,
  getMockProducts,
  getMockSettings,
  saveMockCategory,
  saveMockProduct,
  saveMockSettings,
  toggleMockCategoryVisibility,
} from './mockMenuStore';
import { getMockOrders, updateMockOrderStatus } from './mockOrderStore';

// Initialize memory stores with localStorage support to simulate persistence
const initMessages = () => {
  const stored = window.localStorage.getItem('atd_admin_messages');
  if (stored) return JSON.parse(stored);

  window.localStorage.setItem('atd_admin_messages', JSON.stringify(initialMessages));
  return initialMessages;
};

let ordersStore = getMockOrders();
let productsStore = getMockProducts();
let categoriesStore = getMockCategories();
let messagesStore = initMessages();
let settingsStore = getMockSettings();

const persist = (key, data) => {
  window.localStorage.setItem(key, JSON.stringify(data));
};

export const adminService = {
  // Orders CRUD
  async getOrders() {
    return new Promise((resolve) => {
      setTimeout(() => {
        ordersStore = getMockOrders();
        resolve([...ordersStore]);
      }, 300);
    });
  },

  async updateOrderStatus(orderId, status) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updated = updateMockOrderStatus(orderId, status);
        ordersStore = getMockOrders();
        resolve(updated);
      }, 250);
    });
  },

  // Products CRUD
  async getProducts() {
    return new Promise((resolve) => {
      setTimeout(() => {
        productsStore = getMockProducts();
        resolve([...productsStore]);
      }, 300);
    });
  },

  async saveProduct(product) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = saveMockProduct(product);
        productsStore = getMockProducts();
        resolve(saved);
      }, 300);
    });
  },

  async deleteProduct(productId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        deleteMockProduct(productId);
        productsStore = getMockProducts();
        resolve(true);
      }, 250);
    });
  },

  // Categories CRUD
  async getCategories() {
    return new Promise((resolve) => {
      setTimeout(() => {
        categoriesStore = getMockCategories();
        resolve([...categoriesStore]);
      }, 200);
    });
  },

  async saveCategory(category, oldCategoryId = null) {
    return new Promise((resolve) => {
      setTimeout(() => {
        categoriesStore = saveMockCategory(category, oldCategoryId);
        resolve(categoriesStore);
      }, 200);
    });
  },

  async deleteCategory(categoryId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        deleteMockCategory(categoryId);
        categoriesStore = getMockCategories();
        resolve(true);
      }, 200);
    });
  },

  async toggleCategoryVisibility(categoryId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        categoriesStore = toggleMockCategoryVisibility(categoryId);
        resolve(categoriesStore);
      }, 200);
    });
  },

  // Messages CRUD
  async getMessages() {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...messagesStore]), 250);
    });
  },

  async deleteMessage(messageId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        messagesStore = messagesStore.filter((msg) => msg.id !== messageId);
        persist('atd_admin_messages', messagesStore);
        resolve(true);
      }, 200);
    });
  },

  async markMessageAsRead(messageId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        messagesStore = messagesStore.map((msg) =>
          msg.id === messageId ? { ...msg, read: true } : msg
        );
        persist('atd_admin_messages', messagesStore);
        resolve(true);
      }, 200);
    });
  },

  // Settings CRUD
  async getSettings() {
    return new Promise((resolve) => {
      setTimeout(() => {
        settingsStore = getMockSettings();
        resolve({ ...settingsStore });
      }, 200);
    });
  },

  async updateSettings(settings) {
    return new Promise((resolve) => {
      setTimeout(() => {
        settingsStore = saveMockSettings(settings);
        resolve(settingsStore);
      }, 300);
    });
  },
};
