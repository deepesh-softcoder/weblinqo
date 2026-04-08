import React, { lazy, Suspense } from "react";
import Hero from "./hero";
import Customize from "./customize";
import AnimatedBannerTailwind from "./info-strip";

// Lazy load sections that are below the fold
const TrafficAnalyticsSection = lazy(() => import("./traffic-analytics"));
const SmartLinkSection = lazy(() => import("./smart-link"));
const Faq = lazy(() => import("./faqs"));
const HeroSlider = lazy(() => import("../../../components/slider/template-slider"));
const DigitalCardSlider = lazy(() => import("../../../components/slider/digital-card-slider"));

const SectionLoader = () => (
  <div className="w-full h-48 flex items-center justify-center bg-gray-50/50">
    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

const WebLinqoLanding = () => {
  return (
    <div className="min-h-screen bg-offWhite">
      <AnimatedBannerTailwind />

      {/* Hero Section - Critical for LCP, keep synchronous */}
      <Hero />

      {/* Customize Section - Usually near top, keep synchronous */}
      <Customize />

      <Suspense fallback={<SectionLoader />}>
        {/* Templates */}
        <div id="templates">
          <HeroSlider />
        </div>

        <DigitalCardSlider />

        {/* Traffic Analytics */}
        <TrafficAnalyticsSection />

        {/* FAQs */}
        <Faq />

        {/* Smart link */}
        <SmartLinkSection />
      </Suspense>
    </div>
  )
}

export default WebLinqoLanding;
