import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Ab1 from "../assets/img/ab1.svg";
import Ab2 from "../assets/img/ab2.svg";
import AboutFeature from "../components/AboutFeature";
import { Zap, IndianRupee, Globe } from "lucide-react";
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
        <>
            <section
                ref={heroRef}
                className="relative about-top pt-12 lg:pt-16 min-h-[100vh] flex flex-col justify-center"
            >
                <div className="max-w-7xl w-full flex flex-col lg:flex-row justify-center relative p-6 mx-auto sm:py-12 lg:py-12">

                    {/* LEFT */}
                    <div className="flex z-10 flex-col justify-center text-center  lg:basis-4/5">
                        <div className="text-center">
                            <span
                                className=" me-auto mr-auto
    inline-flex w-fit self-start
    items-center gap-2
    bg-blue-50 border border-blue-200
    px-4 py-1.5
    text-lg font-semibold text-blue-700
    rounded-full mb-6
  wow animate__animated animate__fadeInDown" data-wow-delay="0.3s"
                            >
                                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                                About Us
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className="wow animate__animated animate__fadeInUp text-4xl sm:text-5xl lg:text-7xl font-medium mb-2 lg:mb-4 leading-tight">
                            Empowering Legal & Official <br />
                            <span className="text-blue-600">Communication Across India</span>
                        </h1>

                        <p className="hero-text mt-4 text-lg mb-4 w-full lg:w-[95%] text-gray-700 wow animate__animated animate__fadeInUp" data-wow-delay="0.2s">
                            Texlate was born from a critical observation:<b> Legal professionals, Court clerks, and Government agencies in India </b>struggle with translating vernacular documents. Whether it is an<strong > FIR, Chargesheet, or Panchnama</strong>, the process of converting these from<b> Hindi, Marathi, Gujarati or any other vernacular language to English </b>is time-consuming. We bridged this gap using advanced AI.
                        </p>
                        <p className="hero-text  mb-8 text-lg w-full lg:w-[95%] text-gray-700 wow animate__animated animate__fadeInUp" data-wow-delay="0.4s">
                            We created a <b> Structure preserving translator </b>that doesn't just translate text—it maintains the visual integrity of<b> scanned court orders and land records</b>, saving you hours of reformatting.
                        </p>
                        {/* Buttons */}
                        <div
                            className="lg:mt-6 wow animate__animated text-center justify-center animate__fadeInUp flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
                            data-wow-delay="0.6s"
                        >
                            <a
                                href="#"
                                className="px-8 py-3 text-[15px] font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                Upload & Translate
                            </a>
                            <a
                                href="#"
                                className="px-8 py-3 text-[15px] font-semibold border border-gray-300 rounded-xl hover:bg-gray-100 transition"
                            >
                                View Plans
                            </a>
                        </div>

                    </div>

                </div>
                <img src={Ab1} className="img-ab1" alt="about image 1" />
                <img src={Ab2} className="img-ab2" alt="about image 1" />
            </section>
            <AboutFeature />

            <section
  ref={heroRef}
  className="relative py-24 flex flex-col justify-center bg-gradient-to-b from-blue-50 via-white to-blue-100"
>
  <div className="max-w-4xl mx-auto">
      <div className="rounded-3xl border border-border bg-slate-100 p-10 sm:p-14 shadow relative overflow-hidden">
        
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-[var(--gradient-warm)] pointer-events-none"></div>
        
        <div className="relative">

          {/* Heading */}
          <h2
            className="text-4xl sm:text-4xl mb-6 wow animate__animated animate__fadeInUp"
            style={{ color: "#1e1e1e" }}
            data-wow-delay="0s"
          >
            Making Translation Fast,<br />
            <span className="text-blue-600">Accurate, and Cost-Effective</span>
          </h2>

          {/* Description */}
          <p
            className="leading-relaxed mb-10 wow animate__animated animate__fadeInUp"
            style={{ color: "#1e1e1e" }}
            data-wow-delay="0.2s"
          >
            Our mission is to democratize access to smart PDF translation. Translating a Government Resolution or Legal Notice shouldn't cost a fortune. Our AI enables a cost-effective and fast translation workflow that empowers everyone to understand vernacular language documents instantly.
          </p>

          {/* Feature Grid */}
          <div className="grid sm:grid-cols-3 gap-6">

            {/* Feature 1 */}
            <div
              className="flex items-start gap-3 wow animate__animated animate__fadeInUp"
              data-wow-delay="0.4s"
            >
              <Zap className="h-5 w-5" style={{ color: "#1e1e1e" }} />
              <div>
                <div className="text-sm font-semibold" style={{ color: "#1e1e1e" }}>Lightning Fast</div>
                <div className="text-xs" style={{ color: "#1e1e1e" }}>Results in seconds, not days</div>
              </div>
            </div>

            {/* Feature 2 */}
            <div
              className="flex items-start gap-3 wow animate__animated animate__fadeInUp"
              data-wow-delay="0.6s"
            >
              <IndianRupee className="h-5 w-5" style={{ color: "#1e1e1e" }} />
              <div>
                <div className="text-sm font-semibold" style={{ color: "#1e1e1e" }}>Cost-Effective</div>
                <div className="text-xs" style={{ color: "#1e1e1e" }}>Fraction of manual translation cost</div>
              </div>
            </div>

            {/* Feature 3 */}
            <div
              className="flex items-start gap-3 wow animate__animated animate__fadeInUp"
              data-wow-delay="0.8s"
            >
              <Globe className="h-5 w-5" style={{ color: "#1e1e1e" }} />
              <div>
                <div className="text-sm font-semibold" style={{ color: "#1e1e1e" }}>Any Language</div>
                <div className="text-xs" style={{ color: "#1e1e1e" }}>Hindi, Marathi, Gujarati &amp; more</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
</section>

        </>
    );
};

export default About;
