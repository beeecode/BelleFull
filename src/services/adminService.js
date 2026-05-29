import { categoryService } from './categoryService';
import { notificationService } from './notificationService';
import { orderService } from './orderService';
import { productService } from './productService';
import { settingsService } from './settingsService';

let ordersStore = [];
let productsStore = [];
let categoriesStore = [];
let messagesStore = [];
let settingsStore = {};

export const adminService = {
  // Orders CRUD
  async getOrders() {
    return new Promise((resolve) => {
      setTimeout(async () => {
        ordersStore = await orderService.listAdminOrders();
        resolve([...ordersStore]);
      }, 300);
    });
  },

  async updateOrderStatus(orderId, status) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const updated = await orderService.updateStatus(orderId, status);
        ordersStore = await orderService.listAdminOrders();
        resolve(updated);
      }, 250);
    });
  },

  // Products CRUD
  async getProducts() {
    return new Promise((resolve) => {
      setTimeout(async () => {
        productsStore = await productService.list();
        resolve([...productsStore]);
      }, 300);
    });
  },

  async saveProduct(product) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const saved = await productService.save(product);
        productsStore = await productService.list();
        resolve(saved);
      }, 300);
    });
  },

  async deleteProduct(productId) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        await productService.delete(productId);
        productsStore = await productService.list();
        resolve(true);
      }, 250);
    });
  },

  // Categories CRUD
  async getCategories() {
    return new Promise((resolve) => {
      setTimeout(async () => {
        categoriesStore = await categoryService.list();
        resolve([...categoriesStore]);
      }, 200);
    });
  },

  async saveCategory(category, oldCategoryId = null) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        categoriesStore = await categoryService.save(category, oldCategoryId);
        resolve(categoriesStore);
      }, 200);
    });
  },

  async deleteCategory(categoryId) {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await categoryService.delete(categoryId);
          categoriesStore = await categoryService.list();
          resolve(true);
        } catch (err) {
          reject(err);
        }
      }, 200);
    });
  },

  async toggleCategoryVisibility(categoryId) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        categoriesStore = await categoryService.toggleVisibility(categoryId);
        resolve(categoriesStore);
      }, 200);
    });
  },

  // Messages CRUD
  async getMessages() {
    return new Promise((resolve) => {
      setTimeout(async () => {
        messagesStore = await notificationService.list();
        resolve([...messagesStore]);
      }, 250);
    });
  },

  async deleteMessage(messageId) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        await notificationService.delete(messageId);
        messagesStore = await notificationService.list();
        resolve(true);
      }, 200);
    });
  },

  async markMessageAsRead(messageId) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        await notificationService.markAsRead(messageId);
        messagesStore = await notificationService.list();
        resolve(true);
      }, 200);
    });
  },

  // Settings CRUD
  async getSettings() {
    return new Promise((resolve) => {
      setTimeout(async () => {
        settingsStore = await settingsService.get();
        resolve({ ...settingsStore });
      }, 200);
    });
  },

  async updateSettings(settings) {
    return new Promise((resolve) => {
      setTimeout(async () => {
        settingsStore = await settingsService.update(settings);
        resolve(settingsStore);
      }, 300);
    });
  },
};
