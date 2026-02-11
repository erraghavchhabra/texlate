import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from "swiper/modules";
import { ZoomIn, X } from "lucide-react";
import WOW from "wowjs";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

import Img1 from "../../assets/img/doc-1.jpg";
import Img2 from "../../assets/img/doc-1.jpg";
import Img3 from "../../assets/img/doc-1.jpg";
import Img4 from "../../assets/img/doc-1.jpg";

const images = [Img1, Img2, Img3, Img4];

const DocSlider = () => {
  const [activeImage, setActiveImage] = useState(null);

  // ✅ WOW Init
  useEffect(() => {
    const wow = new WOW.WOW({
      live: false,
    });
    wow.init();
  }, []);

  const closeModal = () => {
    setActiveImage(null);
  };

  return (
    <>
      <section className="w-full h-screen py-20 bg-white overflow-hidden flex items-center">
        <div className="max-w-7xl mx-auto px-4 relative w-full perspective-[1400px]">

          {/* Swiper */}
          <Swiper
            modules={[Navigation, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1.2}
            navigation={{
              nextEl: ".doc-next",
              prevEl: ".doc-prev",
            }}
            coverflowEffect={{
              rotate: 35,
              stretch: 0,
              depth: 220,
              modifier: 1,
              slideShadows: false,
            }}
            breakpoints={{
              768: {
                slidesPerView: 3,
              },
            }}
            className="py-10"
          >
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <div
                  className="wow animate__animated animate__fadeInUp relative group overflow-hidden rounded-2xl shadow-2xl transition-all duration-500"
                  data-wow-delay={`${index * 0.15}s`}
                >
                  <img
                    src={img}
                    alt={`Document ${index + 1}`}
                    className="w-full rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
                    <button
                      onClick={() => setActiveImage(img)}
                      className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <ZoomIn className="w-6 h-6 text-slate-900" />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button className="doc-prev wow animate__animated animate__fadeInLeft absolute left-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition shadow-lg">
            ‹
          </button>

          <button className="doc-next wow animate__animated animate__fadeInRight absolute right-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition shadow-lg">
            ›
          </button>
        </div>
      </section>

      {/* MODAL */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-6 wow animate__animated animate__fadeIn"
          onClick={closeModal}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition"
          >
            <X className="w-6 h-6 text-slate-900" />
          </button>

          <div onClick={(e) => e.stopPropagation()}>
            <img
              src={activeImage}
              alt="Zoomed document"
              className="animate__animated animate__zoomIn max-h-[85vh] max-w-[85vw] object-contain rounded-2xl shadow-2xl bg-white p-3"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DocSlider;
