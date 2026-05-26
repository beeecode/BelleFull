import { Header } from '../../../components/layout/Header';
import { HeroSection } from './sections/HeroSection';
import { MenuSection } from './sections/MenuSection';
import { FeaturedDishesSection } from './sections/FeaturedDishesSection';
import { FeedbackSection } from './sections/FeedbackSection';
import { ExpertsSection } from './sections/ExpertsSection';
import { AppPromoSection } from './sections/AppPromoSection';
import { NewsSocialSection } from './sections/NewsSocialSection';
import { Footer } from '../../../components/layout/Footer';
import { BackToTop } from '../../../components/ui/BackToTop';
import { FigmaBackgroundIllustrations } from '../../../components/common/FigmaBackgroundIllustrations';

export default function LandingPage({ onNavigateHome, onNavigateMenu }) {
  return (
    <>
      <Header
        orderHref="/menu"
        onHomeClick={onNavigateHome}
        onMenuClick={onNavigateMenu}
        onOrderClick={onNavigateMenu}
      />
      <main id="landing-page-root">
        <FigmaBackgroundIllustrations />
        <HeroSection onNavigateMenu={onNavigateMenu} />
        <MenuSection onNavigateMenu={onNavigateMenu} />
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
