import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Hbg from "../assets/img/h-bg.svg";
import HTop from "../assets/img/about.svg";

const About = () => {
    const heroRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(".char", { y: 80, opacity: 0 });
            gsap.set(".hero-subtitle", { y: 30, opacity: 0 });
            gsap.set(".hero-text", { y: 30, opacity: 0 });
            gsap.set(".hero-btn", { y: 20, opacity: 0 });

            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.to(".char", {
                y: 0,
                opacity: 1,
                stagger: 0.03,
                duration: 0.8,
            })
                .to(".hero-subtitle", { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
                .to(".hero-text", { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
                .to(
                    ".hero-btn",
                    { y: 0, opacity: 1, stagger: 0.15, duration: 0.5 },
                    "-=0.3"
                );
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={heroRef}
            className="relative pt-16 lg:pt-16 min-h-[100vh] flex flex-col justify-center"
        >
            <div className="max-w-7xl w-full flex flex-col lg:flex-row justify-between items-center p-6 mx-auto sm:py-12 lg:py-18">

                {/* LEFT */}
                <div className="flex z-10 flex-col justify-center text-center lg:text-left lg:basis-3/5">

                    {/* Heading */}
                    <h1 className="text-4xl sm:text-4xl lg:text-6xl font-medium mb-4 leading-tight">
                        {"About ".split("").map((char, i) => (
                            <span key={i} className="inline-block char">
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                        <span className="text-blue-600">
                            {"Us".split("").map((char, i) => (
                                <span key={i} className="inline-block char">
                                    {char === " " ? "\u00A0" : char}
                                </span>
                            ))}
                        </span>
                    </h1>

 <h2 className="hero-subtitle text-2xl italic text-gray-800">
            Empowering Legal & Official Communication Across India
          </h2>

                    <p className="hero-text mt-6 mb-4 text-md w-full lg:w-[95%] text-gray-700">
                        Texlate was born from a critical observation:<b> Legal professionals, Court clerks, and Government agencies in India </b>struggle with translating vernacular documents. Whether it is an<strong > FIR, Chargesheet, or Panchnama</strong>, the process of converting these from<b> Hindi, Marathi, Gujarati or any other vernacular language to English </b>is time-consuming. We bridged this gap using advanced AI.
                    </p>
                    <p className="hero-text  mb-8 text-md w-full lg:w-[95%] text-gray-700">
                        We created a <b> Structure preserving translator </b>that doesn't just translate text—it maintains the visual integrity of<b> scanned court orders and land records</b>, saving you hours of reformatting.
                    </p>

                </div>

                {/* RIGHT IMAGE */}
                <div className="flex items-center justify-center p-2 lg:p-6 mt-8 lg:mt-0 lg:basis-3/5 relative">
                    <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center">
                        <img src={Hbg} alt="background" className="absolute" />
                        <img src={HTop} alt="platform preview" className="relative ab-img" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
