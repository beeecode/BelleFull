export const IMAGE_UPLOAD_LIMIT_BYTES = 2 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+()\d\s-]{7,20}$/;

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value || '').trim());
}

export function isValidPhone(value) {
  return PHONE_PATTERN.test(String(value || '').trim());
}

export function validateCheckoutFields({
  fields,
  deliveryMethod,
  paymentMethod,
  orderType,
  mealPeriod,
  cartItems,
}) {
  const nextErrors = {};
  const fullName = fields.fullName.trim();
  const phoneNumber = fields.phoneNumber.trim();
  const emailAddress = fields.emailAddress.trim();
  const branch = fields.branch.trim();
  const deliveryAddress = fields.deliveryAddress.trim();

  if (fullName.length < 2) nextErrors.fullName = 'Please enter your full name.';
  if (!isValidPhone(phoneNumber)) nextErrors.phoneNumber = 'Please enter a valid phone number.';
  if (!isValidEmail(emailAddress)) nextErrors.emailAddress = 'Please enter a valid email address for payment.';
  if (!branch) nextErrors.branch = 'Please select a branch.';
  if (!deliveryMethod) nextErrors.deliveryMethod = 'Please select a delivery method.';
  if (!paymentMethod) nextErrors.paymentMethod = 'Please select a payment method.';
  if (deliveryMethod === 'Delivery' && deliveryAddress.length < 8) {
    nextErrors.deliveryAddress = 'Please enter your full delivery address.';
  }

  if (orderType === 'Schedule Order') {
    if (!mealPeriod) nextErrors.mealPeriod = 'Please select meal period, date, and time for your scheduled order.';
    if (!fields.orderDate) nextErrors.orderDate = 'Please select order date.';
    if (!fields.orderTime) nextErrors.orderTime = 'Please select order time.';
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    nextErrors.form = 'Your cart is empty. Please go back to the menu and add food items.';
  }

  return nextErrors;
}

export function validateProductForm(form, categories) {
  const productName = String(form.name || '').trim();
  const description = String(form.description || '').trim();
  const price = Number(form.price);
  const validCategories = new Set(categories.filter((category) => category !== 'All'));

  if (productName.length < 2) return 'Please enter a valid food name.';
  if (!validCategories.has(form.category)) return 'Please select a valid food category.';
  if (description.length < 5) return 'Please enter a short food description.';
  if (!Number.isFinite(price) || price <= 0) return 'Please enter a valid product price.';
  if (typeof form.available !== 'boolean') return 'Please select a valid product availability.';
  if (!form.image) return 'Please upload a food image before saving.';

  return '';
}

export function validateImageFile(file) {
  if (!file) return '';
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Please upload a PNG, JPG, JPEG, or WEBP image.';
  }
  if (file.size > IMAGE_UPLOAD_LIMIT_BYTES) {
    return 'Image is too large. Please upload an image smaller than 2MB.';
  }
  return '';
}

export function validateSettingsDraft(settings = {}) {
  const errors = [];
  const deliveryFee = Number(settings.deliveryFee);

  if (!String(settings.restaurantName || '').trim()) errors.push('Restaurant name is required.');
  if (!isValidPhone(settings.phoneNumber)) errors.push('Phone number must be valid.');
  if (!isValidPhone(settings.whatsAppNumber)) errors.push('WhatsApp number must be valid.');
  if (!String(settings.branches || '').trim()) errors.push('At least one branch is required.');
  if (!Number.isFinite(deliveryFee) || deliveryFee < 0) errors.push('Delivery fee must be a valid amount.');
  if (settings.adminNotificationEmail && !isValidEmail(settings.adminNotificationEmail)) {
    errors.push('Admin notification email must be valid.');
  }

  return errors;
}
