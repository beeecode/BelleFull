import { inspirationAssets } from '../constants/inspirationAssets';
import { siteConfig } from '../constants/siteConfig';
import { InstagramMark } from '../components/InstagramMark';
import { AnimatedSection } from '../components/AnimatedSection';

export function NewsSocialSection() {
  const instagramUrl = siteConfig.contact.socialLinks.find(
    (item) => item.platform === 'Instagram',
  )?.url;

  return (
    <AnimatedSection className="news-social" aria-label="Instagram" direction="left">
      <a
        className="social-grid-card"
        href={instagramUrl ?? 'https://www.instagram.com/amazing_taste_delicacies/'}
        target="_blank"
        rel="noreferrer"
        aria-label="Follow Amazing Taste Delicacies on Instagram"
      >
        <img src={inspirationAssets.socialGrid} alt="Amazing Taste Delicacies gallery" />
        <div>
          <span aria-hidden="true">
            <InstagramMark />
          </span>
          <strong>Follow Us</strong>
        </div>
      </a>
    </AnimatedSection>
  );
}
