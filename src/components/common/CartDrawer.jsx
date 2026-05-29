import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { calculateOrderSubtotal } from '../../utils/orderTotals';
import { useCart } from '../../context/CartContext';
import { getMockSettings } from '../../services/mockMenuStore';

export function CartDrawer({ isOpen, onClose, onCheckout, onBrowseMenu }) {
  const { cartItems, updateCartQuantity, removeFromCart } = useCart();
  const deliveryFee = useMemo(() => Number(getMockSettings().deliveryFee) || 1000, []);
  const subtotal = calculateOrderSubtotal(cartItems);
  const total = subtotal + (cartItems.length > 0 ? deliveryFee : 0);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="cart-drawer-layer">
          <motion.button
            className="cart-drawer-backdrop"
            type="button"
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <header>
              <div>
                <span>
                  <ShoppingBag size={18} aria-hidden="true" />
                </span>
                <h2>Your Cart</h2>
              </div>
              <button type="button" aria-label="Close cart" onClick={onClose}>
                <X size={20} />
              </button>
            </header>

            {cartItems.length > 0 ? (
              <>
                <div className="cart-drawer-items">
                  {cartItems.map((item) => (
                    <article className="cart-drawer-item" key={item.id}>
                      <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
                      <div>
                        <h3>{item.name}</h3>
                        <span>{formatPrice(item.price, item.currency)}</span>
                        <div className="cart-drawer-controls">
                          <button type="button" onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>
                            <Minus size={13} />
                          </button>
                          <strong>{item.quantity}</strong>
                          <button type="button" onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>
                            <Plus size={13} />
                          </button>
                          <button type="button" aria-label={`Remove ${item.name}`} onClick={() => removeFromCart(item.id)}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="cart-drawer-totals">
                  <SummaryLine label="Subtotal" value={formatPrice(subtotal)} />
                  <SummaryLine label="Delivery fee" value={formatPrice(deliveryFee)} />
                  <SummaryLine label="Total" value={formatPrice(total)} strong />
                </div>

                <button className="cart-drawer-checkout" type="button" onClick={onCheckout}>
                  Checkout
                </button>
              </>
            ) : (
              <div className="cart-drawer-empty">
                <ShoppingBag size={34} aria-hidden="true" />
                <h3>Your cart is empty</h3>
                <p>Add a meal from the menu when you are ready to order.</p>
                <button type="button" onClick={onBrowseMenu}>
                  Browse Menu
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

function SummaryLine({ label, value, strong = false }) {
  return (
    <div className={`cart-drawer-total${strong ? ' is-strong' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
