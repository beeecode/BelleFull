/**
 * Service to manage customer order placement.
 * Will later connect with the backend (e.g. POST /api/orders).
 */
export const orderService = {
  /**
   * Place a new order.
   * @param {Object} orderDetails - Customer information, items, delivery, payment
   * @returns {Promise<Object>} The completed order receipt info
   */
  async placeOrder(orderDetails) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!orderDetails.fullName || !orderDetails.phoneNumber || orderDetails.items.length === 0) {
          reject(new Error('Required fields are missing or the cart is empty.'));
          return;
        }

        // Generate mock order number and return details
        const orderNumber = `ATD-${Math.floor(100000 + Math.random() * 900000)}`;
        resolve({
          ...orderDetails,
          orderNumber,
          success: true,
          date: new Date().toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
        });
      }, 600);
    });
  },
};
