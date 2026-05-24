import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, Search, ShoppingBag, X } from 'lucide-react';
import { Header } from '../sections/Header';
import { Footer } from '../sections/Footer';
import { BackToTop } from '../components/BackToTop';
import { FigmaBackgroundIllustrations } from '../components/FigmaBackgroundIllustrations';
import { foodCategories, foodMenuItems } from '../data/foodMenuItems';
import { formatPrice } from '../lib/utils/formatPrice';
import { sectionTransition } from '../constants/motion';

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

export function FoodMenuPage({ cartItems = [], onAddToCart, onNavigateCheckout }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return foodMenuItems.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch =
        !normalizedSearch ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (food, amount = 1) => {
    onAddToCart?.(food, amount);
  };

  const openDetails = (food) => {
    setSelectedFood(food);
    setQuantity(1);
  };

  const closeDetails = () => {
    setSelectedFood(null);
    setQuantity(1);
  };

  return (
    <>
      <Header
        cartCount={cartCount}
        cartHref="/checkout"
        orderHref="/checkout"
        onCartClick={onNavigateCheckout}
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
              {foodCategories.map((category) => (
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

          {filteredItems.length > 0 ? (
            <motion.div
              className="food-menu-grid"
              variants={gridVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredItems.map((food) => (
                <motion.article className="dish-card menu-food-card" key={food.id} variants={cardVariants}>
                  <div className="dish-card-media">
                    <img src={food.image} alt={food.name} />
                    <span>{formatPrice(food.price, food.currency)}</span>
                  </div>
                  <small>{food.category}</small>
                  <h3>{food.name}</h3>
                  <p>{food.description}</p>
                  <div className="menu-card-actions">
                    <button className="menu-card-primary" type="button" onClick={() => addToCart(food)}>
                      <ShoppingBag size={16} />
                      Add to Cart
                    </button>
                    <button className="menu-card-secondary" type="button" onClick={() => openDetails(food)}>
                      View Details
                    </button>
                  </div>
                </motion.article>
              ))}
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

      <AnimatePresence>
        {selectedFood ? (
          <motion.div
            className="food-detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDetails}
          >
            <motion.article
              className="food-detail-modal"
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={sectionTransition}
              onClick={(event) => event.stopPropagation()}
            >
              <button className="food-detail-close" type="button" aria-label="Close details" onClick={closeDetails}>
                <X size={20} />
              </button>
              <img src={selectedFood.image} alt={selectedFood.name} />
              <div>
                <span>{selectedFood.category}</span>
                <h2>{selectedFood.name}</h2>
                <p>{selectedFood.description}</p>
                <strong>{formatPrice(selectedFood.price, selectedFood.currency)}</strong>
                <div className="quantity-control" aria-label="Quantity selector">
                  <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>
                    <Minus size={16} />
                  </button>
                  <span>{quantity}</span>
                  <button type="button" onClick={() => setQuantity((current) => current + 1)}>
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  className="food-detail-add"
                  type="button"
                  onClick={() => {
                    addToCart(selectedFood, quantity);
                    closeDetails();
                  }}
                >
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>
              </div>
            </motion.article>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
