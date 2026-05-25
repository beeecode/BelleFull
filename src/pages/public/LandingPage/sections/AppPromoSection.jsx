import { inspirationAssets } from '../../../../constants/inspirationAssets';
import { projectDetails } from '../../../../data/projectDetails';
import { Button } from '../../../../components/ui/Button';
import { AnimatedSection } from '../../../../components/common/AnimatedSection';

export function AppPromoSection() {
  return (
    <AnimatedSection className="app-promo" direction="fade">
      <img className="app-promo-bg" src={inspirationAssets.appPromoBackground} alt="" loading="lazy" />
      <div className="app-promo-copy">
        <h2>{projectDetails.preservedCopy.reservation.headline}</h2>
        <p>{projectDetails.preservedCopy.reservation.body}</p>
        <div>
          <Button as="a" href="#contact">
            Send request
          </Button>
          <Button
            as="a"
            href={projectDetails.contact.socialLinks[0]?.url ?? '#contact'}
            target="_blank"
            rel="noreferrer"
            variant="dark"
          >
            Instagram
          </Button>
        </div>
      </div>
      <img className="delivery-rider" src={inspirationAssets.deliveryRider} alt="" loading="lazy" />
      <img className="phone-mockup" src={inspirationAssets.phoneMockup} alt="Mobile ordering preview" loading="lazy" />
    </AnimatedSection>
  );
}
