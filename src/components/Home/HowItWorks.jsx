import React from "react";

import uploadImg from "../../assets/img/file.png";
import analysisImg from "../../assets/img/data-analysis.png";
import paymentImg from "../../assets/img/operation.png";
import downloadImg from "../../assets/img/download.png";
import RocketImg from "../../assets/img/rocket.svg";
const steps = [
  {
    title: "Upload Your PDF",
    image: uploadImg,
    text: "Advanced AI translates digital and scanned legal documents across Indian languages with contextual accuracy. Ensures layout preservation, enterprise-grade security, and affordable speed for high-volume legal translation.",
  },
  {
    title: "Smart Analysis",
    image: analysisImg,
    text: "Our system instantly analyses your document:\n• Validates file integrity\n• Calculates total page cost\n• Generates an instant order summary",
  },
  {
    title: "Payment",
    image: paymentImg,
    text: "Complete your payment securely through our payment gateway.",
  },
  {
    title: "Download",
    image: downloadImg,
    text: "Once processing is complete download your translated PDF as well as a Word (.docx) file instantly!",
  },
];

const HowItWorks = () => {
  return (
    <section className="w-full py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-3 big-h">
            How to use Texlate?
          </h2>
        </div>
        <img src={RocketImg} className="rocket-img" alt="" />
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {steps.map((step, i) => (
            <div key={i} className="relative flex">

              {i !== steps.length - 1 && (
                <div className="lg:hidden absolute top-16 h-full w-px bg-blue-200 left-6" />
              )}

              <div className="relative group w-full gsap-up-stagger">

                <div
                  className="
                    m-work-card
                    relative h-full
                    bg-slate-50 rounded-2xl
                    px-6 pt-8 pb-8
                    border border-slate-100
                    transition-all duration-300
                    hover:-translate-y-2
                  "
                >
                  <div className="mb-6">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="
                        w-16 h-16
                        object-contain
                        transition-transform duration-300
                        group-hover:scale-105
                      "
                    />
                  </div>

                  <h3 className="font-semibold text-2xl text-slate-900 mb-3">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {step.text}
                  </p>
                </div>

              </div>
            </div>
          ))}

        </div>

        {/* Video Section */}
        <div className="text-center mt-20">
          <h2 className="text-4xl font-bold mb-12 big-h">
            See how a legal document is translated in 1 minute
          </h2>

          <div className="flex justify-center">
            <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.youtube.com/embed/OHz0xIR8uwI"
                title="Legal document translation demo"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          <div className="mt-12">
            <a
              href="#"
              className="hero-btn px-8 py-3 text-[15px] font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Try Now
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;