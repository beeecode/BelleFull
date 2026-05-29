import { foodCategories, foodMenuItems } from '../data/foodMenuItems';
import { siteConfig } from '../constants/siteConfig';
import { defaultOpeningHours, normalizeOpeningHours } from '../utils/openingHours';

const PRODUCTS_KEY = 'atd_admin_products';
const CATEGORIES_KEY = 'atd_admin_categories';
const SETTINGS_KEY = 'atd_admin_settings';

const slugify = (value) =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const readJson = (key, fallback) => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

function normalizeCategories(rawCategories = foodCategories) {
  return rawCategories.map((category, index) => {
    if (typeof category === 'string') {
      return {
        id: slugify(category) || `category-${index}`,
        name: category,
        isVisible: true,
      };
    }

    return {
      id: category.id || slugify(category.name) || `category-${index}`,
      name: category.name,
      isVisible: category.isVisible ?? category.is_active ?? true,
    };
  });
}

function normalizeProducts(rawProducts = foodMenuItems) {
  return rawProducts.map((product, index) => ({
    ...product,
    id: product.id || `food-${Date.now()}-${index}`,
    currency: product.currency || 'NGN',
    available: product.available ?? true,
  }));
}

function getStoredCategories() {
  const categories = normalizeCategories(readJson(CATEGORIES_KEY, foodCategories));
  writeJson(CATEGORIES_KEY, categories);
  return categories;
}

function getStoredProducts() {
  const products = normalizeProducts(readJson(PRODUCTS_KEY, foodMenuItems));
  writeJson(PRODUCTS_KEY, products);
  return products;
}

export function getMockProducts({ publicOnly = false } = {}) {
  const products = getStoredProducts();

  if (!publicOnly) return products;

  const visibleCategories = new Set(
    getStoredCategories()
      .filter((category) => category.name === 'All' || category.isVisible)
      .map((category) => category.name),
  );

  return products.filter((product) => visibleCategories.has(product.category));
}

export function saveMockProduct(product) {
  const products = getStoredProducts();
  const normalizedProduct = normalizeProducts([product])[0];
  const nextProducts = products.some((item) => item.id === normalizedProduct.id)
    ? products.map((item) => (item.id === normalizedProduct.id ? normalizedProduct : item))
    : [normalizedProduct, ...products];

  writeJson(PRODUCTS_KEY, nextProducts);
  return normalizedProduct;
}

export function deleteMockProduct(productId) {
  const nextProducts = getStoredProducts().filter((item) => item.id !== productId);
  writeJson(PRODUCTS_KEY, nextProducts);
  return true;
}

export function getMockCategories({ publicOnly = false } = {}) {
  const categories = getStoredCategories();
  return publicOnly
    ? categories.filter((category) => category.name === 'All' || category.isVisible)
    : categories;
}

export function saveMockCategory(category, oldCategoryId = null) {
  const categories = getStoredCategories();
  const normalized = typeof category === 'string'
    ? normalizeCategories([category])[0]
    : normalizeCategories([category])[0];
  const previousCategory = categories.find((item) => item.id === oldCategoryId);

  const nextCategories = oldCategoryId
    ? categories.map((item) => (item.id === oldCategoryId ? { ...item, ...normalized, id: item.id } : item))
    : categories.some((item) => item.name.toLowerCase() === normalized.name.toLowerCase())
      ? categories
      : [...categories, normalized];

  writeJson(CATEGORIES_KEY, nextCategories);

  if (previousCategory && previousCategory.name !== normalized.name) {
    const nextProducts = getStoredProducts().map((product) =>
      product.category === previousCategory.name ? { ...product, category: normalized.name } : product,
    );
    writeJson(PRODUCTS_KEY, nextProducts);
  }

  return nextCategories;
}

export function deleteMockCategory(categoryId) {
  const category = getStoredCategories().find((item) => item.id === categoryId);

  if (!category) return true;
  if (category.name === 'All') {
    throw new Error('The All category is required and cannot be deleted.');
  }

  const hasProducts = getStoredProducts().some((product) => product.category === category.name);
  if (hasProducts) {
    throw new Error(`Move or delete products in ${category.name} before deleting this category.`);
  }

  const nextCategories = getStoredCategories().filter((item) => item.id !== categoryId);
  writeJson(CATEGORIES_KEY, nextCategories);
  return true;
}

export function toggleMockCategoryVisibility(categoryId) {
  const nextCategories = getStoredCategories().map((category) =>
    category.id === categoryId ? { ...category, isVisible: !category.isVisible } : category,
  );
  writeJson(CATEGORIES_KEY, nextCategories);
  return nextCategories;
}

export function getMockSettings() {
  const fallbackSettings = {
    restaurantName: siteConfig.restaurantName,
    phoneNumber: '0802 303 7230',
    whatsAppNumber: '0802 303 7230',
    branches: siteConfig.contact.branches
      .map((branch) => `${branch.name} - ${branch.address}`)
      .join('\n'),
    openingHours: defaultOpeningHours,
    deliveryFee: '1000',
    adminNotificationEmail: '',
    address: siteConfig.contact.address,
    instagramLink: siteConfig.contact.socialLinks[0]?.url ?? '',
  };

  const settings = { ...fallbackSettings, ...readJson(SETTINGS_KEY, fallbackSettings) };
  settings.openingHours = normalizeOpeningHours(settings.openingHours);
  writeJson(SETTINGS_KEY, settings);
  return settings;
}

export function saveMockSettings(settings) {
  const normalizedSettings = {
    ...settings,
    openingHours: normalizeOpeningHours(settings.openingHours),
  };
  writeJson(SETTINGS_KEY, normalizedSettings);
  return normalizedSettings;
}
