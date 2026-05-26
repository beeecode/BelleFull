import { useEffect, useState } from 'react';
import { AlertCircle, MessageSquare, ShoppingBag } from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { BackToTop } from '../../../components/ui/BackToTop';
import { FigmaBackgroundIllustrations } from '../../../components/common/FigmaBackgroundIllustrations';
import { formatPrice } from '../../../utils/formatPrice';
import { DEFAULT_ORDER_MESSAGE, getWhatsAppUrl } from '../../../utils/contactLinks';

export default function PaymentFailedPage({ onNavigateHome, onNavigateMenu, onNavigateCheckout }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const storedOrder = sessionStorage.getItem('amazingTasteLastFailedOrder')
      || sessionStorage.getItem('amazingTastePendingOrder');

    if (!storedOrder) return;

    try {
      setOrder(JSON.parse(storedOrder));
    } catch (err) {
      console.error('Error parsing failed order data:', err);
    }
  }, []);

  return (
    <>
      <Header
        orderHref="/menu"
        onHomeClick={onNavigateHome}
        onMenuClick={onNavigateMenu}
        onOrderClick={onNavigateMenu}
      />
      <main id="landing-page-root" className="checkout-page">
        <FigmaBackgroundIllustrations />
        <section id="payment-failed" className="checkout-shell" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="order-success-modal payment-failed-card">
            <span>
              <AlertCircle size={28} />
            </span>
            <h2>Payment could not be verified</h2>
            <p>
              Your order is still saved, but payment was not completed. You can retry payment or return to your cart.
            </p>

            {order ? (
              <div>
                <strong>Order: {order.id}</strong>
                <strong>Total: {formatPrice(order.total || 0)}</strong>
                <strong>Status: {order.order_status || 'pending_payment'}</strong>
              </div>
            ) : null}

            <div className="success-actions">
              <button type="button" className="place-order-button" onClick={onNavigateCheckout}>
                Retry Payment
              </button>
              <button type="button" className="place-order-button" onClick={onNavigateMenu}>
                <ShoppingBag size={18} />
                Return to Cart
              </button>
              <a
                className="place-order-button"
                href={getWhatsAppUrl(DEFAULT_ORDER_MESSAGE)}
                target="_blank"
                rel="noreferrer"
              >
                <MessageSquare size={18} />
                WhatsApp Support
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
