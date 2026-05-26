import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Search, ShoppingBag } from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { BackToTop } from '../../../components/ui/BackToTop';
import { FigmaBackgroundIllustrations } from '../../../components/common/FigmaBackgroundIllustrations';
import { LogoLoader } from '../../../components/common/LogoLoader';
import { CartDrawer } from '../../../components/common/CartDrawer';
import { FoodDetailModal } from '../../../components/modals/FoodDetailModal';
import { useCart } from '../../../context/CartContext';
import { foodService } from '../../../services/foodService';
import { sectionTransition } from '../../../constants/motion';

const gridVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...sectionTransition,
      staggerChildren: 0.055,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: sectionTransition },
};

export default function FoodMenuPage({ onNavigateCheckout, onNavigateHome, onNavigateMenu }) {
  const { cartItems, cartCount, addToCart, updateCartQuantity } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    Promise.all([
      foodService.getFoodMenuItems(),
      foodService.getFoodCategories()
    ]).then(([items, cats]) => {
      if (active) {
        setMenuItems(items);
        setCategories(cats);
        setIsLoading(false);
      }
    }).catch((err) => {
      console.error('Failed to fetch food items:', err);
      if (active) setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch =
        !normalizedSearch ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm, menuItems]);

  const cartItemQuantities = useMemo(
    () => new Map(cartItems.map((item) => [item.id, item.quantity])),
    [cartItems],
  );

  const openDetails = (food) => {
    setSelectedFood(food);
  };

  const closeDetails = () => {
    setSelectedFood(null);
  };

  const updateFoodQuantity = (food, quantity) => {
    updateCartQuantity(food.id, quantity);
  };

  return (
    <>
      <Header
        cartCount={cartCount}
        cartHref="#cart"
        orderHref="/checkout"
        showCart
        onCartClick={(event) => {
          event?.preventDefault();
          setIsCartOpen(true);
        }}
        onHomeClick={onNavigateHome}
        onMenuClick={onNavigateMenu}
        onOrderClick={onNavigateCheckout}
      />
      <main id="landing-page-root" className="food-menu-page">
        <FigmaBackgroundIllustrations />
        <section id="menu" className="food-menu-shell">
          <motion.div
            className="menu-filter-panel"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={sectionTransition}
          >
            <label className="menu-search-field">
              <Search size={20} aria-hidden="true" />
              <input
                type="search"
                value={searchTerm}
                placeholder="Search for pizza, rice, shawarma, parfait..."
                aria-label="Search food menu"
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>

            <div className="menu-category-scroller" aria-label="Food categories">
              {categories.map((category) => (
                <motion.button
                  className={activeCategory === category ? 'is-active' : ''}
                  key={category}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {isLoading ? (
            <div className="food-empty-state">
              <LogoLoader text="Loading menu..." />
            </div>
          ) : filteredItems.length > 0 ? (
            <motion.div
              className="food-menu-grid"
              variants={gridVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredItems.map((food) => {
                const quantity = cartItemQuantities.get(food.id) ?? 0;

                return (
                  <motion.article
                    className={`dish-card menu-food-card ${quantity > 0 ? 'is-in-cart' : ''}`}
                    key={food.id}
                    variants={cardVariants}
                  >
                    <div className="dish-card-media">
                      <img src={food.image} alt={food.name} loading="lazy" decoding="async" />
                      <span>{formatMenuPrice(food.price, food.currency)}</span>
                    </div>
                    {!food.available ? <span className="menu-sold-out-badge">Sold Out</span> : null}
                    <small>{food.category}</small>
                    <h3>{food.name}</h3>
                    <p>{food.description}</p>
                    <div className="menu-card-actions">
                      <MenuItemCartAction
                        food={food}
                        quantity={quantity}
                        onAdd={addToCart}
                        onUpdateQuantity={updateFoodQuantity}
                      />
                      <button className="menu-card-secondary" type="button" onClick={() => openDetails(food)}>
                        View Details
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              className="food-empty-state"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={sectionTransition}
            >
              <p>No food item found. Try another category or search term.</p>
            </motion.div>
          )}
        </section>
      </main>
      <Footer />
      <BackToTop />

      <FoodDetailModal
        isOpen={selectedFood !== null}
        food={selectedFood}
        onClose={closeDetails}
        onAddToCart={addToCart}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onBrowseMenu={() => setIsCartOpen(false)}
        onCheckout={(event) => {
          setIsCartOpen(false);
          onNavigateCheckout?.(event);
        }}
      />
    </>
  );
}

function formatMenuPrice(price, currency = 'NGN') {
  if (price == null) return 'DM';

  if (currency === 'NGN') {
    return `\u20A6${Number(price).toLocaleString('en-NG')}`;
  }

  return Number(price).toLocaleString(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
}

function MenuItemCartAction({ food, quantity, onAdd, onUpdateQuantity }) {
  if (!food.available) {
    return (
      <button className="menu-card-primary is-disabled" type="button" disabled>
        Sold Out
      </button>
    );
  }

  if (quantity <= 0) {
    return (
      <button className="menu-card-primary" type="button" onClick={() => onAdd(food)}>
        <ShoppingBag size={16} aria-hidden="true" />
        Add to Cart
      </button>
    );
  }

  return (
    <div className="menu-cart-stepper" role="group" aria-label={`${food.name} quantity in cart`}>
      <button
        type="button"
        aria-label={`Decrease ${food.name} quantity`}
        onClick={() => onUpdateQuantity(food, quantity - 1)}
      >
        <Minus size={16} aria-hidden="true" />
      </button>
      <strong aria-live="polite">{quantity}</strong>
      <button
        type="button"
        aria-label={`Increase ${food.name} quantity`}
        onClick={() => onUpdateQuantity(food, quantity + 1)}
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
