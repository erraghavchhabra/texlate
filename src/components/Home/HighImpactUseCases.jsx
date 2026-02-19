import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WOW from "wowjs";
import "animate.css";
import { Upload, FileText, Landmark } from "lucide-react";
import Girlimg from "../../assets/img/girl.svg";

const cards = [
  {
    title: "Upload Your PDF",
    text: "Translate scanned and digital legal documents with full layout preservation and enterprise-grade accuracy.",
    icon: Upload,
  },
  {
    title: "7/12 & Property Extracts",
    text: "Best-in-class translation for land records, Ferfar, and property cards while keeping original tables intact.",
    icon: FileText,
  },
  {
    title: "Government Circulars (GRs)",
    text: "Instantly translate official government resolutions with precision and legal reliability.",
    icon: Landmark,
  },
];

const HighImpactUseCases = () => {
  const navigate = useNavigate(); // ✅ MUST be inside component

  useEffect(() => {
    new WOW.WOW({ live: false }).init();
  }, []);

  return (
    <section className="relative lg:h-screen w-full py-28 bg-white overflow-hidden">

      {/* BACKGROUND DECORATION */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-blue-300 to-blue-500 opacity-15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[460px] h-[460px] rounded-full bg-gradient-to-br from-indigo-300 to-purple-400 opacity-10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4">

        {/* Floating Girl Image */}
        <img
          src={Girlimg}
          className="girl-img wow animate__animated animate__zoomIn"
          data-wow-delay="0.2s"
          alt=""
        />

        {/* Section Title */}
        <div className="text-center mb-24">
          <h2
            className="text-4xl font-bold text-slate-900 big-h wow animate__animated animate__fadeInDown"
            data-wow-delay="0.2s"
          >
            High-Impact Use Cases
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

          {/* LEFT CONTENT */}
          <div className="relative z-10">
            <h3
              className="text-3xl font-semibold text-slate-900 mb-10 leading-snug big-h wow animate__animated animate__fadeInLeft"
              data-wow-delay="0.3s"
            >
              Ready to Simplify Your <br />
              Document Workflow?
            </h3>

            <button
              onClick={() => navigate("/upload")}
              className="
                inline-flex items-center justify-center
                bg-blue-500 hover:bg-blue-600
                text-white text-lg font-medium
                px-8 py-4 rounded-xl
                shadow-lg shadow-blue-500/30
                transition-all
                wow animate__animated animate__zoomIn
              "
              data-wow-delay="0.5s"
            >
              Start Translate
            </button>
          </div>

          {/* RIGHT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {cards.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className={`
                    bg-slate-50
                    border border-slate-200
                    rounded-2xl
                    p-6
                    shadow-md
                    hover:shadow-xl
                    transition-all
                    max-w-md
                    wow animate__animated animate__zoomInUp
                    ${index === 0
                      ? "md:row-span-2 bg-white border-blue-200 shadow-xl"
                      : ""
                    }
                  `}
                  data-wow-delay={`${0.4 + index * 0.2}s`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>

                    <h4 className="font-semibold text-lg text-slate-900">
                      {item.title}
                    </h4>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HighImpactUseCases;
