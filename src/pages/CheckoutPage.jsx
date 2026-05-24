import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Check, Clock, Minus, Plus, Trash2 } from 'lucide-react';
import { Header } from '../sections/Header';
import { Footer } from '../sections/Footer';
import { BackToTop } from '../components/BackToTop';
import { FigmaBackgroundIllustrations } from '../components/FigmaBackgroundIllustrations';
import { formatPrice } from '../lib/utils/formatPrice';
import { sectionTransition } from '../constants/motion';

const deliveryMethods = ['Delivery', 'Pickup'];
const orderTypes = ['Order Now', 'Schedule Order'];
const mealPeriods = ['Breakfast', 'Lunch', 'Dinner'];
const paymentMethods = ['Pay on Delivery', 'Bank Transfer', 'Online Payment'];
const deliveryFee = 1000;

const fieldInitialState = {
  fullName: '',
  phoneNumber: '',
  emailAddress: '',
  deliveryAddress: '',
  nearestLandmark: '',
  orderDate: '',
  orderTime: '',
};

const today = new Date().toISOString().slice(0, 10);

function getRecommendedTime(mealPeriod) {
  if (mealPeriod === 'Breakfast') return '08:00';
  if (mealPeriod === 'Lunch') return '13:00';
  if (mealPeriod === 'Dinner') return '19:00';
  return '';
}

export function CheckoutPage({
  cartItems,
  onClearCart,
  onNavigateMenu,
  onRemoveItem,
  onUpdateQuantity,
}) {
  const [fields, setFields] = useState(fieldInitialState);
  const [deliveryMethod, setDeliveryMethod] = useState('Delivery');
  const [orderType, setOrderType] = useState('Order Now');
  const [mealPeriod, setMealPeriod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pay on Delivery');
  const [errors, setErrors] = useState({});
  const [successOrder, setSuccessOrder] = useState(null);

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );
  const activeDeliveryFee = deliveryMethod === 'Delivery' && cartItems.length > 0 ? deliveryFee : 0;
  const grandTotal = subtotal + activeDeliveryFee;
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const updateField = (field, value) => {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: null, form: null }));
  };

  const selectMealPeriod = (period) => {
    setMealPeriod(period);
    setFields((current) => ({
      ...current,
      orderTime: current.orderTime || getRecommendedTime(period),
    }));
    setErrors((current) => ({ ...current, mealPeriod: null, form: null }));
  };

  const validateCheckout = () => {
    const nextErrors = {};

    if (!fields.fullName.trim()) nextErrors.fullName = 'Please enter your full name.';
    if (!fields.phoneNumber.trim()) nextErrors.phoneNumber = 'Please enter your phone number.';
    if (!deliveryMethod) nextErrors.deliveryMethod = 'Please select a delivery method.';
    if (!paymentMethod) nextErrors.paymentMethod = 'Please select a payment method.';
    if (deliveryMethod === 'Delivery' && !fields.deliveryAddress.trim()) {
      nextErrors.deliveryAddress = 'Please enter your delivery address.';
    }
    if (orderType === 'Schedule Order') {
      if (!mealPeriod) nextErrors.mealPeriod = 'Please select meal period, date, and time for your scheduled order.';
      if (!fields.orderDate) nextErrors.orderDate = 'Please select order date.';
      if (!fields.orderTime) nextErrors.orderTime = 'Please select order time.';
    }
    if (cartItems.length === 0) {
      nextErrors.form = 'Your cart is empty. Please go back to the menu and add food items.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const placeOrder = (event) => {
    event.preventDefault();

    if (!validateCheckout()) return;

    setSuccessOrder({
      orderNumber: `ATD-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: fields.fullName,
      orderType,
      deliveryMethod,
      mealPeriod,
      orderDate: fields.orderDate,
      orderTime: fields.orderTime,
      total: grandTotal,
    });
    onClearCart();
  };

  return (
    <>
      <Header cartCount={cartCount} cartHref="/checkout" orderHref="/checkout" />
      <main id="landing-page-root" className="checkout-page">
        <FigmaBackgroundIllustrations />
        <section id="checkout" className="checkout-shell">
          <motion.form
            className="checkout-layout"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={sectionTransition}
            onSubmit={placeOrder}
          >
            <div className="checkout-form-card">
              <CheckoutSection title="Customer Information">
                <div className="checkout-field-grid">
                  <CheckoutField
                    error={errors.fullName}
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={fields.fullName}
                    onChange={(value) => updateField('fullName', value)}
                  />
                  <CheckoutField
                    error={errors.phoneNumber}
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    type="tel"
                    value={fields.phoneNumber}
                    onChange={(value) => updateField('phoneNumber', value)}
                  />
                  <CheckoutField
                    label="Email Address"
                    placeholder="Enter your email address optional"
                    type="email"
                    value={fields.emailAddress}
                    onChange={(value) => updateField('emailAddress', value)}
                  />
                </div>
              </CheckoutSection>

              <CheckoutSection title="Delivery Method" error={errors.deliveryMethod}>
                <OptionGrid>
                  {deliveryMethods.map((method) => (
                    <OptionButton
                      isActive={deliveryMethod === method}
                      key={method}
                      label={method}
                      onClick={() => setDeliveryMethod(method)}
                    />
                  ))}
                </OptionGrid>
                <AnimatePresence mode="wait">
                  {deliveryMethod === 'Delivery' ? (
                    <motion.div
                      className="checkout-field-grid"
                      key="delivery-fields"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={sectionTransition}
                    >
                      <CheckoutField
                        error={errors.deliveryAddress}
                        label="Delivery Address"
                        placeholder="Enter delivery address"
                        value={fields.deliveryAddress}
                        onChange={(value) => updateField('deliveryAddress', value)}
                      />
                      <CheckoutField
                        label="Nearest Landmark"
                        placeholder="Nearest landmark optional"
                        value={fields.nearestLandmark}
                        onChange={(value) => updateField('nearestLandmark', value)}
                      />
                    </motion.div>
                  ) : (
                    <motion.p
                      className="checkout-note"
                      key="pickup-note"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={sectionTransition}
                    >
                      You will pick up your order from Amazing Taste Delicacies restaurant.
                    </motion.p>
                  )}
                </AnimatePresence>
              </CheckoutSection>

              <CheckoutSection title="Order Timing">
                <OptionGrid>
                  {orderTypes.map((type) => (
                    <OptionButton
                      isActive={orderType === type}
                      key={type}
                      label={type}
                      onClick={() => setOrderType(type)}
                    />
                  ))}
                </OptionGrid>
                <AnimatePresence>
                  {orderType === 'Schedule Order' ? (
                    <motion.div
                      className="schedule-panel"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={sectionTransition}
                    >
                      <OptionGrid>
                        {mealPeriods.map((period) => (
                          <OptionButton
                            isActive={mealPeriod === period}
                            key={period}
                            label={period}
                            onClick={() => selectMealPeriod(period)}
                          />
                        ))}
                      </OptionGrid>
                      {errors.mealPeriod ? <span className="field-error">{errors.mealPeriod}</span> : null}
                      <div className="checkout-field-grid">
                        <CheckoutField
                          error={errors.orderDate}
                          icon={<CalendarDays size={18} />}
                          label="Select Order Date"
                          min={today}
                          type="date"
                          value={fields.orderDate}
                          onChange={(value) => updateField('orderDate', value)}
                        />
                        <CheckoutField
                          error={errors.orderTime}
                          icon={<Clock size={18} />}
                          label="Select Order Time"
                          type="time"
                          value={fields.orderTime}
                          onChange={(value) => updateField('orderTime', value)}
                        />
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </CheckoutSection>

              <CheckoutSection title="Payment Method" error={errors.paymentMethod}>
                <OptionGrid>
                  {paymentMethods.map((method) => (
                    <OptionButton
                      isActive={paymentMethod === method}
                      key={method}
                      label={method}
                      onClick={() => setPaymentMethod(method)}
                    />
                  ))}
                </OptionGrid>
              </CheckoutSection>
            </div>

            <motion.aside
              className="order-summary-card"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={sectionTransition}
            >
              <h2>Order Summary</h2>
              {cartItems.length > 0 ? (
                <>
                  <div className="summary-items">
                    {cartItems.map((item) => (
                      <article className="summary-item" key={item.id}>
                        <img src={item.image} alt={item.name} />
                        <div>
                          <h3>{item.name}</h3>
                          <span>{formatPrice(item.price, item.currency)} each</span>
                          <strong>{formatPrice(item.price * item.quantity, item.currency)}</strong>
                          <div className="summary-controls">
                            <button type="button" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                              <Minus size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button type="button" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                              <Plus size={14} />
                            </button>
                            <button type="button" aria-label={`Remove ${item.name}`} onClick={() => onRemoveItem(item.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                  <SummaryLine label="Subtotal" value={formatPrice(subtotal)} />
                  <SummaryLine label="Delivery fee" value={formatPrice(activeDeliveryFee)} />
                  <SummaryLine isStrong label="Grand total" value={formatPrice(grandTotal)} />
                  <div className="checkout-detail-list">
                    <span>Delivery Method: {deliveryMethod}</span>
                    <span>Order Type: {orderType}</span>
                    {orderType === 'Schedule Order' ? (
                      <>
                        <span>Meal Period: {mealPeriod || 'Not selected'}</span>
                        <span>Date: {fields.orderDate || 'Not selected'}</span>
                        <span>Time: {fields.orderTime || 'Not selected'}</span>
                      </>
                    ) : null}
                    <span>Payment Method: {paymentMethod}</span>
                  </div>
                  {errors.form ? <p className="checkout-form-error">{errors.form}</p> : null}
                  <motion.button className="place-order-button" type="submit" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                    Place Order
                  </motion.button>
                </>
              ) : (
                <div className="checkout-empty-cart">
                  <p>Your cart is empty. Please go back to the menu and add food items.</p>
                  <button type="button" onClick={onNavigateMenu}>
                    Back to Menu
                  </button>
                </div>
              )}
            </motion.aside>
          </motion.form>
        </section>
      </main>
      <Footer />
      <BackToTop />

      <AnimatePresence>
        {successOrder ? (
          <motion.div
            className="food-detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.article
              className="order-success-modal"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={sectionTransition}
            >
              <span>
                <Check size={24} />
              </span>
              <h2>Order placed successfully!</h2>
              <p>Order number: {successOrder.orderNumber}</p>
              <div>
                <strong>Customer: {successOrder.customerName}</strong>
                <strong>Order Type: {successOrder.orderType}</strong>
                <strong>Delivery Method: {successOrder.deliveryMethod}</strong>
                {successOrder.orderType === 'Schedule Order' ? (
                  <strong>
                    Scheduled: {successOrder.mealPeriod}, {successOrder.orderDate} at {successOrder.orderTime}
                  </strong>
                ) : null}
                <strong>Total: {formatPrice(successOrder.total)}</strong>
              </div>
              <div className="success-actions">
                <button type="button" onClick={onNavigateMenu}>
                  Back to Menu
                </button>
                <button type="button">Track Order</button>
              </div>
            </motion.article>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function CheckoutSection({ children, error, title }) {
  return (
    <section className="checkout-section-card">
      <h2>{title}</h2>
      {children}
      {error ? <span className="field-error">{error}</span> : null}
    </section>
  );
}

function CheckoutField({ error, icon, label, onChange, ...props }) {
  return (
    <label className="checkout-field">
      <span>{label}</span>
      <div>
        {icon}
        <input {...props} onChange={(event) => onChange(event.target.value)} />
      </div>
      {error ? <small>{error}</small> : null}
    </label>
  );
}

function OptionGrid({ children }) {
  return <div className="checkout-option-grid">{children}</div>;
}

function OptionButton({ isActive, label, onClick }) {
  return (
    <motion.button
      className={isActive ? 'is-active' : ''}
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
    >
      {label}
    </motion.button>
  );
}

function SummaryLine({ isStrong = false, label, value }) {
  return (
    <div className={`summary-line ${isStrong ? 'is-strong' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
