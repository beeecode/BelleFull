import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ShoppingBag, MapPin, MessageSquare, Calendar, Clock } from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { BackToTop } from '../../../components/ui/BackToTop';
import { FigmaBackgroundIllustrations } from '../../../components/common/FigmaBackgroundIllustrations';
import { formatPrice } from '../../../utils/formatPrice';
import { calculateOrderSubtotal, calculateOrderTotal, getOrderDeliveryFee } from '../../../utils/orderTotals';
import { DEFAULT_ORDER_MESSAGE, getWhatsAppUrl } from '../../../utils/contactLinks';
import { sectionTransition } from '../../../constants/motion';

export default function OrderSuccessPage({ onNavigateHome, onNavigateMenu }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const lastOrder = sessionStorage.getItem('amazingTasteLastOrder');
    if (lastOrder) {
      try {
        setOrder(JSON.parse(lastOrder));
      } catch (err) {
        console.error('Error parsing order data:', err);
      }
    }
  }, []);

  const getWhatsAppLink = (ord) => {
    if (!ord) return '#';
    const customerName = ord.customerName || ord.customer?.name || 'Customer';
    const baseText = `Hello Amazing Taste Delicacies! I just placed an order (Number: ${ord.orderNumber || ord.id}).\n\n` +
      `*Details:*\n` +
      `- Customer Name: ${customerName}\n` +
      `- Order Type: ${ord.orderType}\n` +
      `- Delivery Method: ${ord.deliveryMethod}\n` +
      (ord.orderType === 'Schedule Order' ? `- Scheduled: ${ord.mealPeriod}, ${ord.orderDate} at ${ord.orderTime}\n` : '') +
      `- Payment Method: ${ord.paymentMethod}\n` +
      `- Total: ${formatPrice(ord.total)}\n\n` +
      `Thank you!`;
    
    return `https://wa.me/2348023037230?text=${encodeURIComponent(baseText)}`;
  };

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
        <section id="success" className="checkout-shell" style={{ display: 'flex', justifyContent: 'center' }}>
          <motion.div
            className="order-success-modal"
            style={{
              margin: '0 auto',
              maxWidth: '680px',
              width: '100%',
              textAlign: 'left',
              boxShadow: '0 24px 64px rgb(33 26 22 / 8%)',
              border: '1px solid rgb(234 213 196 / 76%)',
            }}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={sectionTransition}
          >
            {order ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                  <span style={{
                    display: 'grid',
                    width: '64px',
                    height: '64px',
                    placeItems: 'center',
                    margin: '0 auto 16px',
                    borderRadius: '50%',
                    background: 'var(--figma-green)',
                    color: '#fff'
                  }}>
                    <Check size={28} />
                  </span>
                  <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)', margin: '0 0 6px' }}>Order placed successfully!</h2>
                  <p style={{
                    color: 'var(--figma-red)',
                    fontFamily: 'var(--display-font)',
                    fontWeight: 700,
                    margin: 0,
                    fontSize: '17px'
                  }}>
                    Order Number: {order.orderNumber || order.id}
                  </p>
                </div>

                <div className="checkout-note" style={{ margin: '16px 0 24px', fontSize: '15px' }}>
                  Thank you for ordering from Amazing Taste Delicacies. We have received your order and our team will start preparing it shortly.
                </div>

                <div className="checkout-section-card" style={{ padding: '20px', marginBottom: '18px' }}>
                  <h3 style={{ margin: '0 0 14px', fontFamily: 'var(--font-serif)', fontSize: '20px' }}>Order Overview</h3>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--figma-soft)', paddingBottom: '6px' }}>
                      <span style={{ color: 'var(--figma-muted)' }}>Customer Name</span>
                      <strong>{order.customerName || order.customer?.name}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--figma-soft)', paddingBottom: '6px' }}>
                      <span style={{ color: 'var(--figma-muted)' }}>Delivery Method</span>
                      <strong>{order.deliveryMethod}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--figma-soft)', paddingBottom: '6px' }}>
                      <span style={{ color: 'var(--figma-muted)' }}>Payment Method</span>
                      <strong>{order.paymentMethod}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--figma-soft)', paddingBottom: '6px' }}>
                      <span style={{ color: 'var(--figma-muted)' }}>Payment Status</span>
                      <strong>{order.paymentStatus || order.payment_status || 'Paid'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--figma-soft)', paddingBottom: '6px' }}>
                      <span style={{ color: 'var(--figma-muted)' }}>Payment Reference</span>
                      <strong>{order.paymentReference || 'MOCK-PAYMENT'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--figma-soft)', paddingBottom: '6px' }}>
                      <span style={{ color: 'var(--figma-muted)' }}>Order Timing</span>
                      <strong>{order.orderType}</strong>
                    </div>
                    {order.orderType === 'Schedule Order' && (
                      <div style={{
                        marginTop: '6px',
                        padding: '12px',
                        borderRadius: '12px',
                        background: 'var(--figma-soft)',
                        display: 'grid',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                          <Calendar size={15} style={{ color: 'var(--figma-red)' }} />
                          <span>Meal Period: <strong>{order.mealPeriod}</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                          <Calendar size={15} style={{ color: 'var(--figma-red)' }} />
                          <span>Date: <strong>{order.orderDate}</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                          <Clock size={15} style={{ color: 'var(--figma-red)' }} />
                          <span>Time: <strong>{order.orderTime}</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="checkout-section-card" style={{ padding: '20px', marginBottom: '18px' }}>
                    <h3 style={{ margin: '0 0 14px', fontFamily: 'var(--font-serif)', fontSize: '20px' }}>Food Items</h3>
                    <div className="summary-items" style={{ maxHeight: '260px' }}>
                      {order.items.map((item) => (
                        <div className="summary-item" key={item.id} style={{ padding: '10px' }}>
                          <img src={item.image} alt={item.name} loading="lazy" decoding="async" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px' }} />
                          <div>
                            <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontFamily: 'var(--font-serif)' }}>{item.name}</h4>
                            <span style={{ color: 'var(--figma-muted)', fontSize: '13px' }}>
                              {item.quantity} x {formatPrice(item.price)}
                            </span>
                            <strong style={{ display: 'block', color: 'var(--figma-red)', marginTop: '4px' }}>
                              {formatPrice(item.price * item.quantity)}
                            </strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="checkout-section-card" style={{ padding: '20px', marginBottom: '24px' }}>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--figma-muted)', fontSize: '15px' }}>
                      <span>Subtotal</span>
                      <span>{formatPrice(calculateOrderSubtotal(order))}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--figma-muted)', fontSize: '15px' }}>
                      <span>Delivery Fee</span>
                      <span>{formatPrice(getOrderDeliveryFee(order))}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--figma-line)',
                      paddingTop: '10px',
                      marginTop: '6px',
                      fontSize: '19px',
                      fontWeight: 'bold',
                      color: 'var(--figma-black)'
                    }}>
                      <span>Total Paid</span>
                      <span style={{ color: 'var(--figma-red)' }}>{formatPrice(calculateOrderTotal(order))}</span>
                    </div>
                  </div>
                </div>

                <div className="success-actions" style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={onNavigateMenu}
                    className="place-order-button"
                    style={{ padding: '0 24px', display: 'inline-flex', gap: '8px', alignItems: 'center' }}
                  >
                    <ShoppingBag size={18} />
                    Back to Menu
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => alert('Order tracking is in simulation mode.')}
                    className="place-order-button"
                    style={{
                      padding: '0 24px',
                      background: 'transparent',
                      border: '1px solid var(--figma-line)',
                      color: 'var(--figma-text)',
                      boxShadow: 'none',
                      display: 'inline-flex',
                      gap: '8px',
                      alignItems: 'center'
                    }}
                  >
                    <MapPin size={18} style={{ color: 'var(--figma-green)' }} />
                    Track Order
                  </button>

                  <a
                    href={getWhatsAppLink(order)}
                    target="_blank"
                    rel="noreferrer"
                    className="place-order-button"
                    style={{
                      padding: '0 24px',
                      background: '#25D366',
                      boxShadow: '0 18px 34px rgb(37 211 102 / 20%)',
                      display: 'inline-flex',
                      gap: '8px',
                      alignItems: 'center',
                      color: '#fff',
                      textDecoration: 'none'
                    }}
                  >
                    <MessageSquare size={18} />
                    Contact on WhatsApp
                  </a>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', marginBottom: '12px' }}>Order details could not be found</h2>
                <p style={{ color: 'var(--figma-muted)', marginBottom: '24px' }}>
                  Order details could not be found. Please contact support if payment was completed.
                </p>
                <div className="success-actions" style={{ justifyContent: 'center' }}>
                  <button type="button" onClick={onNavigateMenu} className="place-order-button" style={{ padding: '0 24px' }}>
                    Go to Menu
                  </button>
                  <a
                    href={getWhatsAppUrl(DEFAULT_ORDER_MESSAGE)}
                    target="_blank"
                    rel="noreferrer"
                    className="place-order-button"
                    style={{ padding: '0 24px', background: '#25D366', color: '#fff', textDecoration: 'none' }}
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
