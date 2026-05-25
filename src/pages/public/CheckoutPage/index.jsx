import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Clock, Minus, Plus, Trash2 } from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { BackToTop } from '../../../components/ui/BackToTop';
import { FigmaBackgroundIllustrations } from '../../../components/common/FigmaBackgroundIllustrations';
import { useCart } from '../../../context/CartContext';
import { orderService } from '../../../services/orderService';
import { formatPrice } from '../../../utils/formatPrice';
import { sectionTransition } from '../../../constants/motion';

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

export default function CheckoutPage({ onNavigateMenu }) {
  const { cartItems, clearCart, removeFromCart, updateCartQuantity, cartCount } = useCart();
  const [fields, setFields] = useState(fieldInitialState);
  const [deliveryMethod, setDeliveryMethod] = useState('Delivery');
  const [orderType, setOrderType] = useState('Order Now');
  const [mealPeriod, setMealPeriod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pay on Delivery');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );
  const activeDeliveryFee = deliveryMethod === 'Delivery' && cartItems.length > 0 ? deliveryFee : 0;
  const grandTotal = subtotal + activeDeliveryFee;

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

  const placeOrder = async (event) => {
    event.preventDefault();

    if (!validateCheckout()) return;

    setIsSubmitting(true);
    try {
      const receipt = await orderService.placeOrder({
        fullName: fields.fullName,
        phoneNumber: fields.phoneNumber,
        emailAddress: fields.emailAddress,
        deliveryMethod,
        deliveryAddress: fields.deliveryAddress,
        nearestLandmark: fields.nearestLandmark,
        orderType,
        mealPeriod,
        orderDate: fields.orderDate,
        orderTime: fields.orderTime,
        paymentMethod,
        items: cartItems,
        total: grandTotal,
      });

      // Save order details to sessionStorage to survive page refresh
      sessionStorage.setItem(
        'amazingTasteLastOrder',
        JSON.stringify({
          orderNumber: receipt.orderNumber,
          customerName: receipt.fullName,
          orderType: receipt.orderType,
          deliveryMethod: receipt.deliveryMethod,
          mealPeriod: receipt.mealPeriod,
          orderDate: receipt.orderDate,
          orderTime: receipt.orderTime,
          total: receipt.total,
          items: cartItems,
          paymentMethod: receipt.paymentMethod,
          subtotal: subtotal,
          deliveryFee: activeDeliveryFee,
        })
      );

      clearCart();
      window.history.pushState({}, '', '/success');
      window.dispatchEvent(new Event('popstate'));
    } catch (err) {
      setErrors((current) => ({ ...current, form: err.message }));
    } finally {
      setIsSubmitting(false);
    }
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
                    disabled={isSubmitting}
                  />
                  <CheckoutField
                    error={errors.phoneNumber}
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    type="tel"
                    value={fields.phoneNumber}
                    onChange={(value) => updateField('phoneNumber', value)}
                    disabled={isSubmitting}
                  />
                  <CheckoutField
                    label="Email Address"
                    placeholder="Enter your email address optional"
                    type="email"
                    value={fields.emailAddress}
                    onChange={(value) => updateField('emailAddress', value)}
                    disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                        disabled={isSubmitting}
                      />
                      <CheckoutField
                        label="Nearest Landmark"
                        placeholder="Nearest landmark optional"
                        value={fields.nearestLandmark}
                        onChange={(value) => updateField('nearestLandmark', value)}
                        disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                            disabled={isSubmitting}
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
                          disabled={isSubmitting}
                        />
                        <CheckoutField
                          error={errors.orderTime}
                          icon={<Clock size={18} />}
                          label="Select Order Time"
                          type="time"
                          value={fields.orderTime}
                          onChange={(value) => updateField('orderTime', value)}
                          disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                        <img src={item.image} alt={item.name} loading="lazy" />
                        <div>
                          <h3>{item.name}</h3>
                          <span>{formatPrice(item.price, item.currency)} each</span>
                          <strong>{formatPrice(item.price * item.quantity, item.currency)}</strong>
                          <div className="summary-controls">
                            <button type="button" onClick={() => updateCartQuantity(item.id, item.quantity - 1)} disabled={isSubmitting}>
                              <Minus size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button type="button" onClick={() => updateCartQuantity(item.id, item.quantity + 1)} disabled={isSubmitting}>
                              <Plus size={14} />
                            </button>
                            <button type="button" aria-label={`Remove ${item.name}`} onClick={() => removeFromCart(item.id)} disabled={isSubmitting}>
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
                  <motion.button
                    className="place-order-button"
                    type="submit"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
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

function CheckoutField({ error, icon, label, onChange, disabled, ...props }) {
  return (
    <label className="checkout-field">
      <span>{label}</span>
      <div>
        {icon}
        <input {...props} disabled={disabled} onChange={(event) => onChange(event.target.value)} />
      </div>
      {error ? <small>{error}</small> : null}
    </label>
  );
}

function OptionGrid({ children }) {
  return <div className="checkout-option-grid">{children}</div>;
}

function OptionButton({ isActive, label, onClick, disabled }) {
  return (
    <motion.button
      className={isActive ? 'is-active' : ''}
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
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
