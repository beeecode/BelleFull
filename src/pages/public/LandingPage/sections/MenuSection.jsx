import { Coffee, Flame, Utensils, ChefHat } from 'lucide-react';
import { inspirationAssets } from '../../../../constants/inspirationAssets';
import { menuItems } from '../../../../data/menuItems';
import { projectDetails } from '../../../../data/projectDetails';
import { formatPrice } from '../../../../utils/formatPrice';
import { SectionHeading } from '../../../../components/ui/SectionHeading';
import { AnimatedSection } from '../../../../components/common/AnimatedSection';

const categories = [
  { label: menuItems[0]?.name ?? 'Signature Pasta', icon: Utensils },
  { label: menuItems[1]?.name ?? 'Creamy Alfredo', icon: Flame },
  { label: menuItems[2]?.name ?? 'Local Twist Pasta', icon: ChefHat },
  { label: menuItems[3]?.name ?? 'Smokey Jollof Rice', icon: Coffee },
];

export function MenuSection() {
  return (
    <AnimatedSection id="menu" className="menu-section" direction="right">
      <div className="category-row" aria-label="Menu categories">
        {categories.map((item, index) => {
          const Icon = item.icon;
          return (
            <button className={index === 0 ? 'is-active' : ''} key={item.label} type="button">
              <Icon size={44} strokeWidth={1.9} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="menu-showcase">
        <img className="menu-plate" src={inspirationAssets.menuPlate} alt="" loading="lazy" />
        <div className="menu-list-panel">
          <p className="menu-kicker">{projectDetails.preservedCopy.menu.headline}</p>
          <h2>{projectDetails.preservedCopy.menu.body}</h2>
          <div className="menu-list">
            {menuItems.map((item) => (
              <article key={item.id}>
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
                <strong>{formatPrice(item.price, item.currency)}</strong>
              </article>
            ))}
          </div>
        </div>
      </div>

      <SectionHeading title="Menu" className="discover-heading" />
    </AnimatedSection>
  );
}
