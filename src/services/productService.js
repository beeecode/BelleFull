import { deleteMockProduct, getMockProducts, saveMockProduct } from './mockMenuStore';

export const productService = {
  async list({ publicOnly = false } = {}) {
    return getMockProducts({ publicOnly });
  },

  async save(product) {
    return saveMockProduct(product);
  },

  async delete(productId) {
    return deleteMockProduct(productId);
  },
};
