import React, { useEffect } from "react";
import WOW from "wowjs";
import "animate.css";

const VideoSec = () => {
  useEffect(() => {
    new WOW.WOW({ live: false }).init();
  }, []);

  return (
    <section className="w-full md:min-h-screen flex items-center py-20 bg-white relative overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="max-md:hidden absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40 animate-pulse"></div>
      <div className="max-md:hidden absolute bottom-10 right-10 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        <div className="text-center">

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold mb-12 wow animate__animated animate__zoomIn">
            See how a legal document is translated in 1 minute
          </h2>

          {/* Video */}
          <div className="flex justify-center wow animate__animated animate__zoomIn" data-wow-delay="0.2s">
            <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.02] hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.6)]">
              
              {/* Animated Border Glow */}
              <div className="absolute inset-0 rounded-2xl border border-blue-200 pointer-events-none"></div>

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

          {/* Button */}
          {/* <div className="mt-14 wow animate__animated animate__zoomIn" data-wow-delay="0.4s">
            <a
              href="#"
              className="inline-block px-8 py-3 text-[15px] font-semibold rounded-xl 
              bg-blue-600 text-white
              transition-all duration-300
              hover:bg-blue-700 hover:-translate-y-1
              hover:shadow-[0_15px_40px_-10px_rgba(59,130,246,0.7)]
              active:scale-95"
            >
              Try Now
            </a>
          </div> */}

        </div>
      </div>
    </section>
  );
};

export default VideoSec;
