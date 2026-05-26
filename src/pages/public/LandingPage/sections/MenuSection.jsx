import { ChefHat, Coffee, Flame, Utensils } from 'lucide-react';
import { menuItems } from '../../../../data/menuItems';
import { AnimatedSection } from '../../../../components/common/AnimatedSection';

const categories = [
  { label: menuItems[0]?.name ?? 'Signature Pasta', icon: Utensils },
  { label: menuItems[1]?.name ?? 'Creamy Alfredo', icon: Flame },
  { label: menuItems[2]?.name ?? 'Local Twist Pasta', icon: ChefHat },
  { label: menuItems[3]?.name ?? 'Smokey Jollof Rice', icon: Coffee },
];

export function MenuSection({ onNavigateMenu }) {
  return (
    <AnimatedSection id="menu" className="menu-section menu-category-section" direction="right">
      <div className="category-row" aria-label="Menu categories">
        {categories.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              className={index === 0 ? 'is-active' : ''}
              key={item.label}
              type="button"
              onClick={onNavigateMenu}
            >
              <Icon size={44} strokeWidth={1.9} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </AnimatedSection>
  );
}
