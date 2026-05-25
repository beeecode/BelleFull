import { useEffect, useMemo, useState } from 'react';
import { inspirationAssets } from '../../../../constants/inspirationAssets';
import { projectDetails } from '../../../../data/projectDetails';
import { testimonials } from '../../../../data/testimonials';
import { InstagramMark } from '../../../../components/ui/InstagramMark';
import { AnimatedSection } from '../../../../components/common/AnimatedSection';

export function FeedbackSection() {
  const slides = useMemo(() => {
    const avatars = [
      projectDetails.visualAssets.customerPortrait,
      inspirationAssets.authorPortrait,
      inspirationAssets.chefs[0],
      inspirationAssets.chefs[1],
      inspirationAssets.chefs[2],
    ];

    const media = [
      inspirationAssets.feedbackCollage,
      inspirationAssets.menuPlate,
      inspirationAssets.promoSteak,
      inspirationAssets.blogImages[0],
      inspirationAssets.socialGrid,
    ];

    return testimonials.map((testimonial, index) => ({
      ...testimonial,
      avatar: avatars[index % avatars.length],
      media: media[index % media.length],
    }));
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <AnimatedSection id="reviews" className="feedback-section" direction="left">
      <div className="feedback-inner">
        <div className="feedback-card" aria-live="polite">
          <p>{projectDetails.preservedCopy.reviews.headline}</p>
          <div className="feedback-quote-card">
            <blockquote key={activeSlide.quote}>{activeSlide.quote}</blockquote>
            <span className="feedback-avatar">
              <img src={activeSlide.avatar} alt="" loading="lazy" />
            </span>
          </div>
          <div className="feedback-author">
            <span aria-hidden="true">
              <InstagramMark />
            </span>
            <div>
              <strong>{activeSlide.name}</strong>
              <small>{activeSlide.instagramHandle}</small>
            </div>
          </div>
          <div className="feedback-dots" aria-hidden="true">
            {slides.map((slide, index) => (
              <button
                className={index === activeIndex ? 'is-active' : ''}
                key={slide.instagramHandle}
                type="button"
                tabIndex="-1"
              />
            ))}
          </div>
        </div>
        <div className="feedback-media">
          <img
            key={activeSlide.media}
            src={activeSlide.media}
            alt="Amazing Taste Delicacies customer highlight"
            loading="lazy"
          />
        </div>
      </div>
    </AnimatedSection>
  );
}
