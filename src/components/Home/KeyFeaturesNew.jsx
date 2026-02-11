// @ts-nocheck

import React, { useEffect } from "react";
import WOW from "wowjs";
import {
  FileText,
  Shield,
  Brain,
  LayoutTemplate,
  Languages,
  Zap,
} from "lucide-react";

const keyFeatures = [
  {
    number: "01",
    icon: Brain,
    title: "AI-Powered Accuracy",
    description:
      "Leverage advanced machine learning models to achieve 99%+ accuracy in document parsing, data extraction, and content recognition across all formats.",
    color: "from-[hsl(45,90%,55%)] to-[hsl(35,90%,50%)]",
    borderColor: "border-[hsl(45,90%,55%)]",
    position: "top",
  },
  {
    number: "02",
    icon: FileText,
    title: "Scanned Document Support",
    description:
      "Seamlessly process scanned PDFs, photos, and handwritten documents with state-of-the-art OCR technology that handles any quality level.",
    color: "from-[hsl(150,70%,45%)] to-[hsl(170,70%,40%)]",
    borderColor: "border-[hsl(150,70%,45%)]",
    position: "bottom",
  },
  {
    number: "03",
    icon: LayoutTemplate,
    title: "Structure & Layout Preservation",
    description:
      "Maintain original document formatting including tables, headers, footers, and complex multi-column layouts during conversion.",
    color: "from-[hsl(186,78%,45%)] to-[hsl(220,70%,55%)]",
    borderColor: "border-[hsl(186,78%,45%)]",
    position: "top",
  },
  {
    number: "04",
    icon: Languages,
    title: "Vernacular Language Expert",
    description:
      "Support for 50+ regional and vernacular languages with native script recognition and accurate transliteration capabilities.",
    color: "from-[hsl(220,70%,55%)] to-[hsl(250,70%,60%)]",
    borderColor: "border-[hsl(220,70%,55%)]",
    position: "bottom",
  },
  {
    number: "05",
    icon: Zap,
    title: "Fast & Cost-Effective",
    description:
      "Process thousands of pages per minute at a fraction of the cost of manual data entry, saving up to 90% on document processing.",
    color: "from-[hsl(45,90%,55%)] to-[hsl(35,90%,50%)]",
    borderColor: "border-[hsl(45,90%,55%)]",
    position: "top",
  },
  {
    number: "06",
    icon: Shield,
    title: "Secure & Confidential",
    description:
      "Enterprise-grade encryption, SOC 2 compliance, and zero data retention policies ensure your sensitive documents stay protected.",
    color: "from-[hsl(150,70%,45%)] to-[hsl(170,70%,40%)]",
    borderColor: "border-[hsl(150,70%,45%)]",
    position: "bottom",
  },
];

export default function KeyFeaturesNew() {
  useEffect(() => {
    new WOW.WOW({ live: false }).init();
  }, []);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/20 to-background overflow-hidden">
      <div className="container mx-auto">

        {/* Header */}
        <div className="text-center mb-12 md:mb-20 wow animate__animated animate__fadeInDown">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How to use Texlate?
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful capabilities designed to handle documents at enterprise scale.
          </p>
        </div>

        <div className="relative">

          {/* Desktop Connecting Line */}
          <svg
            className="hidden lg:block absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 pointer-events-none z-0"
            viewBox="0 0 1200 120"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M 50 60 Q 150 60 200 20 L 300 20 Q 350 20 400 60 Q 450 100 500 100 L 600 100 Q 650 100 700 60 Q 750 20 800 20 L 900 20 Q 950 20 1000 60 Q 1050 100 1100 100 L 1150 100"
              stroke="url(#gradient-line)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              className="animate-pulse"
            />
            <defs>
              <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(45, 90%, 55%)" />
                <stop offset="33%" stopColor="hsl(150, 70%, 45%)" />
                <stop offset="66%" stopColor="hsl(186, 78%, 45%)" />
                <stop offset="100%" stopColor="hsl(220, 70%, 55%)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
            {keyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const isTop = feature.position === "top";

              return (
                <div
                  key={index}
                  className={`flex flex-col lg:${
                    isTop ? "justify-start" : "justify-end pt-16"
                  } wow animate__animated animate__fadeInUp`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative group">
                    <div
                      className={`relative bg-white rounded-[2rem] p-6 border-2 ${feature.borderColor} shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
                    >
                      {/* Number Badge */}
                      <div
                        className={`absolute -top-1 -right-1 w-12 h-12 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        {feature.number}
                      </div>

                      {/* Icon */}
                      <div
                        className={`w-14 h-14 rounded-2xl mb-5 bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-bold mb-3">
                        {feature.title}
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
