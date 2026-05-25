import { adminOrders } from '../data/adminOrders';
import { foodCategories, foodMenuItems } from '../data/foodMenuItems';
import { customers } from '../data/customers';
import { initialMessages } from '../data/messages';
import { siteConfig } from '../constants/siteConfig';

// Initialize memory stores with localStorage support to simulate persistence
const initOrders = () => {
  const stored = window.localStorage.getItem('atd_admin_orders');
  if (stored) return JSON.parse(stored);

  const mapped = adminOrders.map((order, index) => ({
    ...order,
    customer: customers[index % customers.length],
    deliveryMethod: index % 2 === 0 ? 'Delivery' : 'Pickup',
    orderType: index === 4 ? 'Scheduled Order' : 'Order Now',
    mealPeriod: index === 4 ? 'Dinner' : '',
    scheduledDate: index === 4 ? '2026-05-24' : '',
    scheduledTime: index === 4 ? '7:30 PM' : '',
    paymentMethod: ['Pay on Delivery', 'Bank Transfer', 'Online Payment'][index % 3],
    paymentStatus: index % 3 === 1 ? 'Paid' : 'Pending',
    status: ['new', 'accepted', 'completed', 'preparing', 'ready', 'cancelled'][index],
  }));

  window.localStorage.setItem('atd_admin_orders', JSON.stringify(mapped));
  return mapped;
};

const initProducts = () => {
  const stored = window.localStorage.getItem('atd_admin_products');
  if (stored) return JSON.parse(stored);

  const mapped = foodMenuItems.map((item, index) => ({
    ...item,
    available: index % 5 !== 0,
  }));

  window.localStorage.setItem('atd_admin_products', JSON.stringify(mapped));
  return mapped;
};

const initCategories = () => {
  const stored = window.localStorage.getItem('atd_admin_categories');
  if (stored) return JSON.parse(stored);

  window.localStorage.setItem('atd_admin_categories', JSON.stringify(foodCategories));
  return foodCategories;
};

const initMessages = () => {
  const stored = window.localStorage.getItem('atd_admin_messages');
  if (stored) return JSON.parse(stored);

  window.localStorage.setItem('atd_admin_messages', JSON.stringify(initialMessages));
  return initialMessages;
};

const initSettings = () => {
  const stored = window.localStorage.getItem('atd_admin_settings');
  if (stored) return JSON.parse(stored);

  const settings = {
    restaurantName: siteConfig.restaurantName,
    phoneNumber: '0802 303 7230',
    whatsAppNumber: '0802 303 7230',
    email: '',
    address: siteConfig.contact.address,
    openingHours: 'Orders on Instagram',
    deliveryFee: '1000',
    instagramLink: siteConfig.contact.socialLinks[0]?.url ?? '',
  };

  window.localStorage.setItem('atd_admin_settings', JSON.stringify(settings));
  return settings;
};

let ordersStore = initOrders();
let productsStore = initProducts();
let categoriesStore = initCategories();
let messagesStore = initMessages();
let settingsStore = initSettings();

const persist = (key, data) => {
  window.localStorage.setItem(key, JSON.stringify(data));
};

export const adminService = {
  // Orders CRUD
  async getOrders() {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...ordersStore]), 300);
    });
  },

  async updateOrderStatus(orderId, status) {
    return new Promise((resolve) => {
      setTimeout(() => {
        ordersStore = ordersStore.map((order) =>
          order.id === orderId ? { ...order, status } : order
        );
        persist('atd_admin_orders', ordersStore);
        resolve(true);
      }, 250);
    });
  },

  // Products CRUD
  async getProducts() {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...productsStore]), 300);
    });
  },

  async saveProduct(product) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = productsStore.findIndex((item) => item.id === product.id);
        if (index > -1) {
          productsStore[index] = product;
        } else {
          productsStore = [product, ...productsStore];
        }
        persist('atd_admin_products', productsStore);
        resolve(product);
      }, 300);
    });
  },

  async deleteProduct(productId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        productsStore = productsStore.filter((item) => item.id !== productId);
        persist('atd_admin_products', productsStore);
        resolve(true);
      }, 250);
    });
  },

  // Categories CRUD
  async getCategories() {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...categoriesStore]), 200);
    });
  },

  async saveCategory(categoryName, oldCategoryName = null) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (oldCategoryName) {
          categoriesStore = categoriesStore.map((cat) =>
            cat === oldCategoryName ? categoryName : cat
          );
        } else if (!categoriesStore.includes(categoryName)) {
          categoriesStore = [...categoriesStore, categoryName];
        }
        persist('atd_admin_categories', categoriesStore);
        resolve(categoriesStore);
      }, 200);
    });
  },

  async deleteCategory(categoryName) {
    return new Promise((resolve) => {
      setTimeout(() => {
        categoriesStore = categoriesStore.filter((cat) => cat !== categoryName);
        persist('atd_admin_categories', categoriesStore);
        resolve(true);
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
      setTimeout(() => resolve({ ...settingsStore }), 200);
    });
  },

  async updateSettings(settings) {
    return new Promise((resolve) => {
      setTimeout(() => {
        settingsStore = { ...settings };
        persist('atd_admin_settings', settingsStore);
        resolve(settingsStore);
      }, 300);
    });
  },
};
