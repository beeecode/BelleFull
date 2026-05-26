import { inspirationAssets } from '../../../../constants/inspirationAssets';
import { projectDetails } from '../../../../data/projectDetails';
import { AnimatedSection } from '../../../../components/common/AnimatedSection';

export function AboutSection() {
  return (
    <AnimatedSection id="about" className="about-section" direction="left">
      <div className="about-inner">
        <div className="about-title">
          <p>About us</p>
          <h2>{projectDetails.preservedCopy.welcome.headline}</h2>
        </div>
        <div className="about-copy">
          <p>{projectDetails.preservedCopy.welcome.body}</p>
          <div className="operator-card">
            <img src={inspirationAssets.authorPortrait} alt="" loading="lazy" decoding="async" />
            <div>
              <strong>Amazing Taste Delicacies</strong>
              <span>The Pasta Haven in Osogbo</span>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
