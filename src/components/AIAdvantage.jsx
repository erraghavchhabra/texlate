import React from "react";
import {
  FileText,
  Scale,
  Globe,
  Landmark,
  Zap,
  BadgeDollarSign,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Layout & Structure Preserving Translator",
    desc: "Maintains formatting, tables, margins, and structure exactly like the original PDF. Ideal for legal, government, and official documents.",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    icon: BadgeDollarSign,
    title: "Affordable and Assured Pricing with Premium Accuracy",
    desc: "Professional-quality translations at a fraction of traditional costs. Pay per page of your original document, not the expanded translated version.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Scale,
    title: "Bulk Document Translation for High Court & Supreme Court",
    desc: "Translate 100+ page FIRs, Chargesheets, and case files instantly. Designed for law firms and legal departments.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Globe,
    title: "Vernacular to English Translation",
    desc: "Translate Indian regional languages like Hindi, Marathi, Telugu, and Bengali — including handwritten and scanned PDFs.",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: Landmark,
    title: "Smart PDF Translator for Land Records & Government Docs",
    desc: "Ensures proper terminology, consistency, and precision required for official submissions.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: Zap,
    title: "Fast and Instant PDF Translator",
    desc: "Get fully translated documents in seconds — not hours or days.",
    gradient: "from-violet-500 to-fuchsia-600",
  },
];

const AIAdvantage = () => {
  return (
    <section className="bg-slate-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 wow animate__animated animate__fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
            The AI Advantage
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Discover how we provide a superior solution for your modern
            translation needs.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="wow animate__animated animate__fadeInUp bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                data-wow-delay={`${index * 0.1}s`}
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white mb-6`}
                >
                  <Icon size={26} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-slate-800 mb-4 leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* ================= CTA SECTION ================= */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between wow animate__animated animate__fadeInUp">
            {/* Left Text */}
            <p className="text-white text-lg md:text-xl font-semibold mb-4 md:mb-0 max-w-xl text-center md:text-left">
              Unlock instant legal PDF translation — Try it now.
            </p>

            {/* Right Button */}
            <a
              href="#"
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIAdvantage;
