import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { sectionTransition } from '../../constants/motion';

export function FoodDetailModal({ isOpen, food, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  // Reset quantity when food changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen, food]);

  return (
    <AnimatePresence>
      {isOpen && food ? (
        <motion.div
          className="food-detail-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.article
            className="food-detail-modal"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={sectionTransition}
            onClick={(event) => event.stopPropagation()}
          >
            <button className="food-detail-close" type="button" aria-label="Close details" onClick={onClose}>
              <X size={20} />
            </button>
            <img src={food.image} alt={food.name} loading="lazy" />
            <div>
              <span>{food.category}</span>
              <h2>{food.name}</h2>
              <p>{food.description}</p>
              <strong>{formatPrice(food.price, food.currency)}</strong>
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
                  onAddToCart(food, quantity);
                  onClose();
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
  );
}
