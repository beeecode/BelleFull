import {
  deleteMockCategory,
  getMockCategories,
  saveMockCategory,
  toggleMockCategoryVisibility,
} from './mockMenuStore';

export const categoryService = {
  async list({ publicOnly = false } = {}) {
    return getMockCategories({ publicOnly });
  },

  async save(category, oldCategoryId = null) {
    return saveMockCategory(category, oldCategoryId);
  },

  async delete(categoryId) {
    return deleteMockCategory(categoryId);
  },

  async toggleVisibility(categoryId) {
    return toggleMockCategoryVisibility(categoryId);
  },
};
