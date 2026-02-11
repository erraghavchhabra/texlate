// @ts-nocheck
import React, { useEffect, useState } from "react";
import WOW from "wowjs";
import "animate.css";
import {
  Brain,
  FileText,
  LayoutTemplate,
  Languages,
  Zap,
  Shield,
} from "lucide-react";

/* ======================= DATA ======================= */

const features = [
  {
    label: "AI-Powered Accuracy",
    icon: Brain,
    side: "left",
    description:
      "Leverage advanced machine learning models to achieve 99%+ accuracy in document parsing, data extraction, and content recognition across all formats.",
  },
  {
    label: "Scanned Document Support",
    icon: FileText,
    side: "left",
    description:
      "Seamlessly process scanned PDFs, photos, and handwritten documents with state-of-the-art OCR technology that handles any quality level.",
  },
  {
    label: "Structure & Layout Preservation",
    icon: LayoutTemplate,
    side: "left",
    description:
      "Maintain original document formatting including tables, headers, footers, and complex multi-column layouts during conversion.",
  },
  {
    label: "Vernacular Language Expert",
    icon: Languages,
    side: "right",
    description:
      "Support for 50+ regional and vernacular languages with native script recognition and accurate transliteration capabilities.",
  },
  {
    label: "Fast & Cost-Effective",
    icon: Zap,
    side: "right",
    description:
      "Process thousands of pages per minute at a fraction of the cost of manual data entry, saving up to 90% on document processing.",
  },
  {
    label: "Secure & Confidential",
    icon: Shield,
    side: "right",
    description:
      "Enterprise-grade encryption ensures your sensitive documents stay protected.",
  },
];

/* ======================= COMPONENTS ======================= */

const ConnectorDot = ({ side }) => (
  <div
    className={`hidden md:flex items-center gap-2 wow animate__animated animate__zoomIn ${
      side === "left" ? "flex-row" : "flex-row-reverse"
    }`}
    data-wow-delay="0.2s"
  >
    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
    <div className="w-12 border-t-2 border-dashed border-blue-300" />
    <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-500 bg-white shadow-sm" />
  </div>
);

const FeaturePill = ({ label, icon: Icon, description, onHover, delay }) => {
  return (
    <div
      onMouseEnter={() => onHover?.(label)}
      onMouseLeave={() => onHover?.(null)}
      className="group wow animate__animated animate__zoomIn"
      data-wow-delay={delay}
    >
      <div
        className="flex items-center gap-4
        min-w-[260px] lg:min-w-[320px]
        rounded-full border border-blue-300/60
        bg-blue-50/40 px-5 py-3
        text-sm font-medium text-slate-900
        transition-all duration-300
        hover:border-blue-500 hover:bg-blue-50
        hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.6)]"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-blue-200 transition-colors group-hover:border-blue-500">
          <Icon className="h-6 w-6 text-blue-500 transition-transform duration-300 group-hover:scale-110" />
        </span>
        <span className="whitespace-nowrap">{label}</span>
      </div>

      {/* Mobile Description */}
      <div className="md:hidden mt-3 text-sm text-slate-600 px-4 text-center">
        {description}
      </div>
    </div>
  );
};

/* ======================= SECTION ======================= */

const KeyFeatures = () => {
  const [activeFeature, setActiveFeature] = useState(null);

  useEffect(() => {
    new WOW.WOW({ live: false }).init();
  }, []);

  const left = features.filter((f) => f.side === "left");
  const right = features.filter((f) => f.side === "right");
  const activeData = features.find((f) => f.label === activeFeature);

  return (
    <section className="w-full py-24 md:h-screen flex items-center bg-slate-50">
      <div className="mx-auto max-w-7xl px-4">

        {/* Title */}
        <div className="text-center mb-16 wow animate__animated animate__zoomIn">
          <h2 className="text-4xl font-bold mb-3">Key Features</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Powerful capabilities designed to handle documents at enterprise scale.
          </p>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center justify-center gap-8 relative">

          {/* Left */}
          <div className="flex flex-col gap-10 items-end flex-1">
            {left.map((f, i) => (
              <div key={f.label} className="flex items-center">
                <FeaturePill {...f} onHover={setActiveFeature} delay={`${i * 0.2}s`} />
                <ConnectorDot side="left" />
              </div>
            ))}
          </div>

          {/* Center */}
          <div className="relative flex-shrink-0 wow animate__animated animate__zoomIn" data-wow-delay="0.3s">
            <div className="w-44 h-44 rounded-full border-2 border-dashed border-blue-300 bg-white flex items-center justify-center shadow-lg text-center">
              <span className="text-xl font-semibold">
                Key <br /> Features
              </span>
            </div>

            {activeData && (
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-[100%] w-[300px] z-20 rounded-xl border border-blue-200 bg-white p-4 shadow-xl text-sm wow animate__animated animate__zoomIn">
                <div className="font-semibold text-slate-900 mb-1">
                  {activeData.label}
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {activeData.description}
                </p>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex flex-col gap-10 items-start flex-1">
            {right.map((f, i) => (
              <div key={f.label} className="flex items-center">
                <ConnectorDot side="right" />
                <FeaturePill {...f} onHover={setActiveFeature} delay={`${i * 0.2}s`} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex flex-col gap-6 items-center">
          {features.map((f, i) => (
            <FeaturePill key={f.label} {...f} delay={`${i * 0.2}s`} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default KeyFeatures;
