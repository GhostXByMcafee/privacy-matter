'use client';

import { Header, Footer, HeroSection, PrivacyTools, ResourcesSection } from '../components/LocalizedComponents';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PrivacyTools />
        <ResourcesSection />
      </main>
      <Footer />
    </>
  );
} 