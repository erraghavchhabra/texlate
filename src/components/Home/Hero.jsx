import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Hbg from "../../assets/img/h-bg.svg";
import HTop from "../../assets/img/h-top.png";
const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Initial hidden states (VERY IMPORTANT)
      gsap.set(".char", { y: 80, opacity: 0 });
      gsap.set(".hero-subtitle", { y: 30, opacity: 0 });
      gsap.set(".hero-text", { y: 30, opacity: 0 });
      gsap.set(".hero-btn", { y: 20, opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Heading chars
      tl.to(".char", {
        y: 0,
        opacity: 1,
        stagger: 0.03,
        duration: 0.8,
      })

        // Subtitle
        .to(
          ".hero-subtitle",
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
          },
          "-=0.4"
        )

        // Paragraph
        .to(
          ".hero-text",
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
          },
          "-=0.4"
        )

        // Buttons
        .to(
          ".hero-btn",
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 0.5,
          },
          "-=0.3"
        );

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="hero relative pt-10 lg:pt-18 min-h-[100vh] flex flex-col justify-center"
    >
      <div className="max-w-7xl w-full flex flex-col lg:flex-row justify-between items-center p-6 mx-auto sm:py-12 lg:py-18">

        {/* LEFT */}
        <div className="flex z-10 flex-col justify-center text-center lg:text-left lg:basis-3/5 xl:basis-3/6">

          {/* Heading */}
          <h1 className="hero-heading text-4xl sm:text-5xl lg:text-7xl font-medium mb-2 lg:mb-4 leading-tight">
            {"PDF Document".split("").map((char, i) => (
              <span key={i} className="inline-block char">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}

            <br />

            <span className="text-blue-600">
              {"Translator".split("").map((char, i) => (
                <span key={i} className="inline-block char">
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
          </h1>

          <h2 className="hero-subtitle text-2xl italic text-gray-800">
            Vernacular & Legal Documents to English
          </h2>

          <p className="hero-text mt-6 mb-8 text-lg w-full lg:w-[70%] sm:mb-12 text-gray-700">
            Secure AI translation of legal and government PDFs into English,
            preserving original layout and accuracy.
          </p>

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <a
              href="#"
              className="hero-btn px-8 py-3 text-[15px] font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Upload & Translate
            </a>
            <a
              href="#"
              className="hero-btn px-8 py-3 text-[15px] font-semibold border border-gray-300 rounded-xl hover:bg-gray-100 transition"
            >
              View Plans
            </a>
          </div>

        </div>

        {/* RIGHT IMAGE SECTION */}
        <div className="flex items-center justify-center p-2 lg:p-6 mt-8 lg:mt-0 lg:basis-3/6 relative">
          <div className="hero-img relative w-full h-[400px] lg:h-[500px] flex items-center justify-center">
            <img src={Hbg} alt="hero background" className="absolute " />
            <img src={HTop} className="relative rounded-xl" />
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default Hero;
