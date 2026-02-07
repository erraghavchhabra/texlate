import React from "react";
import Hero from "../components/Home/Hero";
import DocSlider from "../components/Home/Docslider";
import KeyFeatures from "../components/Home/KeyFeatures";
import HowItWorks from "../components/Home/HowItWorks";
import WhyChooseUs from "../components/Home/WhyChooseUs";
import HighImpactUseCases from "../components/Home/HighImpactUseCases";
import Testimonial from "../components/Home/Testimonial";
import FAQSection from "../components/Home/FAQSection";
export default function Home() {
  return (
    <>
      <Hero />
      <DocSlider />
      <KeyFeatures />
      <HowItWorks />
      <WhyChooseUs />
      <HighImpactUseCases />
      <Testimonial />
      <FAQSection />
    </>
  );
}
