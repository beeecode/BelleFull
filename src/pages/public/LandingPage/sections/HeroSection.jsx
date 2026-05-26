import { MapPin, Phone, ShoppingBag } from 'lucide-react';
import { projectDetails } from '../../../../data/projectDetails';
import { Button } from '../../../../components/ui/Button';
import { InstagramMark } from '../../../../components/ui/InstagramMark';
import { AnimatedSection } from '../../../../components/common/AnimatedSection';
import { DEFAULT_ORDER_MESSAGE, getMapsUrl, getWhatsAppUrl } from '../../../../utils/contactLinks';
import heroStaffImage from '../../../../assets/figma-inspiration/8f05362a16d5c15175d5d6e8349beb730885358e.png';

export function HeroSection({ onNavigateMenu }) {
  const instagramUrl = projectDetails.contact.socialLinks[0]?.url ?? '#contact';
  const whatsAppUrl = getWhatsAppUrl(DEFAULT_ORDER_MESSAGE);
  const mapsUrl = getMapsUrl(projectDetails.contact.address);

  return (
    <AnimatedSection id="home" className="hero" direction="fade">
      <div className="hero-inner">
        <div className="hero-copy-block">
          <span className="hero-kicker">Amazing Taste Delicacies</span>
          <h1>{projectDetails.preservedCopy.hero.headline}</h1>
          <p>{projectDetails.preservedCopy.hero.body}</p>
          <div className="hero-actions">
            <Button as="a" href="/menu" onClick={onNavigateMenu}>
              View menu
            </Button>
            <a
              className="video-link"
              href={whatsAppUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span>
                <ShoppingBag size={19} />
              </span>
              <strong>Chat on WhatsApp</strong>
            </a>
          </div>

          <div className="hero-socials" aria-label="Amazing Taste contact links">
            <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramMark />
            </a>
            <a href={whatsAppUrl} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
              <Phone size={18} />
            </a>
            <a href={mapsUrl} target="_blank" rel="noreferrer" aria-label="Osogbo location">
              <MapPin size={18} />
            </a>
            <span />
          </div>
        </div>

        <div className="hero-media" aria-label="Amazing Taste food preview">
          <div className="hero-staff-frame">
            <div className="hero-staff-orbit" aria-hidden="true" />
            <img
              className="hero-staff-image"
              src={heroStaffImage}
              alt="Amazing Taste Delicacies team member"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
