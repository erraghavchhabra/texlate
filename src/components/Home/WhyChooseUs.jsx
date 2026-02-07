import React from "react";
import { CheckCircle } from "lucide-react";

const features = [
  "Fast and instant PDF translator (Seconds)",
  "Cost-effective translator (Low fixed rates)",
  "Layout preserving translator (Keeps format)",
  "Supports Hindi, Marathi, Telugu, Bengali & more",
  "Smart PDF translator for FIRs/Records",
];

const WhyChooseUs = () => {
  return (
    <section
      className="
        relative w-full py-28 text-white
        bg-gradient-to-b from-[#05070a] via-[#080b12] to-[#05070a]
        overflow-hidden
      "
    >
      {/* Subtle background grid */}
      <div
        className="
          absolute inset-0 opacity-[0.06]
          [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)]
          [background-size:32px_32px]
          pointer-events-none
        "
      />

      {/* Soft blue ambient glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-semibold mb-3 big-h">
            Why choose us?
          </h2>
        </div>

        {/* Table Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start text-[14px]">

          {/* Features Column */}
          <div>
            <h3 className="text-lg text-slate-400 mb-6">Features</h3>
            <ul className="space-y-4">
              <li className="border-b border-white/10 pb-4 gsap-up">Speed</li>
              <li className="border-b border-white/10 pb-4 gsap-up">Cost</li>
              <li className="border-b border-white/10 pb-4 gsap-up">Layout & Formatting</li>
              <li className="border-b border-white/10 pb-4 gsap-up">Input Language</li>
              <li className="border-b border-white/10 pb-4 gsap-up">Legal Precision</li>
            </ul>
          </div>

          {/* Human Translation */}
          <div>
            <h3 className="text-lg text-slate-400 mb-6">
              Human Translation
            </h3>

            <ul className="space-y-4">
              {features.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 border-b border-white/10 pb-4 text-slate-300 gsap-up-stagger"
                >
                  <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Powered Translation (Premium Highlight) */}
          <div
            className="
              relative rounded-2xl
              border border-blue-500/40
              bg-gradient-to-b from-blue-500/15 via-blue-500/5 to-transparent
              p-5
              backdrop-blur-sm
              shadow-[0_0_0_1px_rgba(59,130,246,0.25),0_20px_60px_-30px_rgba(59,130,246,0.6)]
            "
          >
            <h3 className="text-blue-400 text-lg mb-6">
              AI Powered Translation
            </h3>

            <ul className="space-y-4">
              {features.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 border-b border-white/10 pb-4 gsap-up-stagger"
                >
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                  <span className="text-white">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="#"
            className="hero-btn px-8 py-3 text-[15px] font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Read More
          </a>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
