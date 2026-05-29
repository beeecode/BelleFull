import {
  createMockOrder,
  getMockOrders,
  markMockOrderFailed,
  markMockOrderPaid,
  updateMockOrderStatus,
} from './mockOrderStore';
import { isValidEmail, isValidPhone } from '../utils/validation';

/**
 * Service to manage customer order placement.
 * Will later connect with the backend (e.g. POST /api/orders).
 */
export const orderService = {
  async listAdminOrders() {
    return getMockOrders();
  },

  async updateStatus(orderId, status) {
    return updateMockOrderStatus(orderId, status);
  },

  /**
   * Create a pending order before payment.
   * @param {Object} orderDetails - Customer information, items, delivery, payment
   * @returns {Promise<Object>} The pending order info
   */
  async placeOrder(orderDetails) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (
          !String(orderDetails.fullName || '').trim() ||
          !isValidPhone(orderDetails.phoneNumber) ||
          !isValidEmail(orderDetails.emailAddress) ||
          !orderDetails.branch ||
          orderDetails.items.length === 0
        ) {
          reject(new Error('Required fields are missing or the cart is empty.'));
          return;
        }

        if (orderDetails.delivery_method === 'delivery' && !String(orderDetails.delivery_address || '').trim()) {
          reject(new Error('Delivery address is required.'));
          return;
        }

        resolve(createMockOrder(orderDetails));
      }, 600);
    });
  },

  async confirmMockPayment(orderId) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(markMockOrderPaid(orderId)), 500);
    });
  },

  async failMockPayment(orderId) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(markMockOrderFailed(orderId)), 350);
    });
  },
};
