import { useMemo, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, ShoppingBag } from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { BackToTop } from '../../../components/ui/BackToTop';
import { FigmaBackgroundIllustrations } from '../../../components/common/FigmaBackgroundIllustrations';
import { FoodDetailModal } from '../../../components/modals/FoodDetailModal';
import { useCart } from '../../../context/CartContext';
import { foodService } from '../../../services/foodService';
import { formatPrice } from '../../../utils/formatPrice';
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

export default function FoodMenuPage({ onNavigateCheckout }) {
  const { cartItems, cartCount, addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const openDetails = (food) => {
    setSelectedFood(food);
  };

  const closeDetails = () => {
    setSelectedFood(null);
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
              <p>Loading delicious menu...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <motion.div
              className="food-menu-grid"
              variants={gridVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredItems.map((food) => (
                <motion.article className="dish-card menu-food-card" key={food.id} variants={cardVariants}>
                  <div className="dish-card-media">
                    <img src={food.image} alt={food.name} loading="lazy" />
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

      <FoodDetailModal
        isOpen={selectedFood !== null}
        food={selectedFood}
        onClose={closeDetails}
        onAddToCart={addToCart}
      />
    </>
  );
}
