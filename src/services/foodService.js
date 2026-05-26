import { getMockCategories, getMockProducts } from './mockMenuStore';

/**
 * Service to manage food menu items and categories.
 * Readily structured for migration to API requests (e.g. GET /api/foods).
 */
export const foodService = {
  /**
   * Fetch all food items from the menu.
   * @returns {Promise<Array>}
   */
  async getFoodMenuItems() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockProducts({ publicOnly: true }));
      }, 300);
    });
  },

  /**
   * Fetch all available food categories.
   * @returns {Promise<Array<string>>}
   */
  async getFoodCategories() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockCategories({ publicOnly: true }).map((category) => category.name));
      }, 200);
    });
  },
};
