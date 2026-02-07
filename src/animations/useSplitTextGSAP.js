import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function useSplitTextGSAP() {
  useEffect(() => {

    /* ======================
       SPLIT TEXT ANIMATION
    ====================== */

    document.querySelectorAll(".ab-sub-h, .big-h").forEach((el) => {
      const split = new SplitType(el, { types: "words, chars" });

      gsap.set(split.chars, {
        opacity: 0,
        y: 50,
        display: "inline-block",
      });

      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        onEnter: () => {
          gsap.to(split.chars, {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.8,
            ease: "power3.out",
          });
        },
        onEnterBack: () => {
          gsap.to(split.chars, {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.8,
            ease: "power3.out",
          });
        },
      });
    });

    /* ======================
       SIMPLE SLIDE UP
    ====================== */

    gsap.utils.toArray(".gsap-up").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    /* ======================
       STAGGER SLIDE UP
    ====================== */

    gsap.utils.toArray(".gsap-up-stagger").forEach((group) => {
      const items = group.children;

      gsap.fromTo(
        items,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: group,
            start: "top 80%",
          },
        }
      );
    });

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
}
