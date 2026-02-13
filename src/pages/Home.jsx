import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import Hero from "../components/Home/Hero";
import DocSlider from "../components/Home/Docslider";
import KeyFeatures from "../components/Home/KeyFeatures";
import KeyFeaturesNew from "../components/Home/KeyFeaturesNew";
import VideoSec from "../components/Home/VideoSec";
import WhyChooseUs from "../components/Home/WhyChooseUs";
import HighImpactUseCases from "../components/Home/HighImpactUseCases";
import Testimonial from "../components/Home/Testimonial";
import FAQSection from "../components/Home/FAQSection";
import Footer from "../components/Footer";

export default function Home() {
  const [index, setIndex] = useState(0);
  const isScrolling = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // 👈 track modal state

  const sections = [
    <Hero key="hero" />,
    <DocSlider key="docslider" onModalChange={setModalOpen} />, // 👈 pass callback
    <KeyFeatures key="features" />,
    <KeyFeaturesNew key="new" />,
    <VideoSec key="video" />,
    <WhyChooseUs key="why" />,
    <HighImpactUseCases key="usecases" />,
    <Testimonial key="testimonial" />,
    <FAQSection key="faq" />,
    <Footer key="footer" />,
  ];

  // Detect mobile on mount + resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1000);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll handler (desktop only)
  useEffect(() => {
    if (isMobile || modalOpen) return; // 🚫 disable when modal open

    const handleWheel = (e) => {
      if (isScrolling.current) return;
      isScrolling.current = true;

      if (e.deltaY > 0) {
        setIndex((prev) => Math.min(prev + 1, sections.length - 1));
      } else {
        setIndex((prev) => Math.max(prev - 1, 0));
      }

      setTimeout(() => {
        isScrolling.current = false;
      }, 800);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [sections.length, isMobile, modalOpen]);

  // Arrow keys (desktop only)
  useEffect(() => {
    if (isMobile || modalOpen) return; // 🚫 disable when modal open

    const handleKey = (e) => {
      if (isScrolling.current) return;

      if (e.key === "ArrowDown") {
        setIndex((prev) => Math.min(prev + 1, sections.length - 1));
      }

      if (e.key === "ArrowUp") {
        setIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [sections.length, isMobile, modalOpen]);

  const progress = (index / (sections.length - 1)) * 100;

  return (
    <div className="relative w-full overflow-hidden">
      {/* PROGRESS BAR */}
      <div className="max-md:hidden fixed top-16 left-0 w-full h-[2px] bg-transparent z-50">
        <div
          className="h-full bg-blue-600 transition-all duration-150 "
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* MOBILE: normal stacked scroll */}
      {isMobile ? (
        <div className="w-full">{sections.map((Section) => Section)}</div>
      ) : (
        /* DESKTOP: motion scroll effect */
        <div className="relative h-screen w-full">
          {sections.map((Section, i) => {
            const isActive = i === index;

            return (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  y:
                    index === sections.length
                      ? "-100%"
                      : i < index
                      ? "-100%"
                      : isActive
                      ? "0%"
                      : "100%",
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute top-0 left-0 w-full h-screen"
                style={{ zIndex: i }}
              >
                {isActive && Section}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
