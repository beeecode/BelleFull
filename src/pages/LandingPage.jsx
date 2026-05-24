import { Header } from '../sections/Header';
import { HeroSection } from '../sections/HeroSection';
import { MenuSection } from '../sections/MenuSection';
import { FeaturedDishesSection } from '../sections/FeaturedDishesSection';
import { FeedbackSection } from '../sections/FeedbackSection';
import { ExpertsSection } from '../sections/ExpertsSection';
import { AppPromoSection } from '../sections/AppPromoSection';
import { NewsSocialSection } from '../sections/NewsSocialSection';
import { Footer } from '../sections/Footer';
import { BackToTop } from '../components/BackToTop';
import { FigmaBackgroundIllustrations } from '../components/FigmaBackgroundIllustrations';

export function LandingPage({ onNavigateMenu }) {
  return (
    <>
      <Header cartHref="/menu" orderHref="/menu" onCartClick={onNavigateMenu} onOrderClick={onNavigateMenu} />
      <main id="landing-page-root">
        <FigmaBackgroundIllustrations />
        <HeroSection />
        <MenuSection />
        <FeaturedDishesSection />
        <FeedbackSection />
        <ExpertsSection />
        <AppPromoSection />
        <NewsSocialSection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
