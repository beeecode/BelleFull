import { menuItems } from '../../../../data/menuItems';
import { projectDetails } from '../../../../data/projectDetails';
import { formatPrice } from '../../../../utils/formatPrice';
import { SectionHeading } from '../../../../components/ui/SectionHeading';
import { AnimatedSection } from '../../../../components/common/AnimatedSection';

export function FeaturedDishesSection() {
  return (
    <AnimatedSection
      id="featured-dishes"
      className="featured-section"
      aria-label="Featured dishes"
      direction="fade"
    >
      <SectionHeading title={projectDetails.preservedCopy.menu.headline} />
      <div className="dish-grid">
        {menuItems.map((dish) => (
          <article className="dish-card" key={dish.id}>
            <div className="dish-card-media">
              <img src={projectDetails.visualAssets[dish.imageKey]} alt={dish.name} loading="lazy" />
              <span>{dish.price == null ? 'DM' : formatPrice(dish.price, dish.currency)}</span>
            </div>
            <h3>{dish.name}</h3>
            <p>{dish.description}</p>
          </article>
        ))}
      </div>
      <div className="small-dots" aria-hidden="true">
        <span className="is-active" />
        <span />
        <span />
      </div>
    </AnimatedSection>
  );
}
