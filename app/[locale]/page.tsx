'use client';

import { 
  Header, 
  Footer, 
  HeroSection, 
  PrivacyTools, 
  ResourcesSection, 
  PartnersSection,
  NewsletterSection 
} from '../components/LocalizedComponents';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PrivacyTools />
        <ResourcesSection />
        <PartnersSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
} 