import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow, Autoplay } from "swiper/modules";
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

const DocSlider = ({ onModalChange }) => {
  const [activeSlide, setActiveSlide] = useState(null);

  // WOW Init
  useEffect(() => {
    const wow = new WOW.WOW({ live: false });
    wow.init();
  }, []);

  // Disable background scroll + notify parent
  useEffect(() => {
    if (activeSlide !== null) {
      document.body.style.overflow = "hidden";
      onModalChange?.(true);
    } else {
      document.body.style.overflow = "";
      onModalChange?.(false);
    }
  }, [activeSlide, onModalChange]);

  const closeModal = () => setActiveSlide(null);

  return (
    <>
      <section className="w-full h-screen py-20 bg-white overflow-hidden flex items-center">
        <div className="max-w-7xl mx-auto px-4 relative w-full perspective-[1400px]">

          {/* Swiper */}
          <Swiper
            modules={[Navigation, EffectCoverflow, Autoplay]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={false}
            slidesPerView={1.2}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
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
              768: { slidesPerView: 3, spaceBetween: 10 },
            }}
            className="py-10"
          >
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <div
                  className="wow animate__animated animate__fadeInUp relative group overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 flex gap-4"
                  data-wow-delay={`${index * 0.15}s`}
                >
                  <img
                    src={img}
                    alt={`Document ${index + 1} Left`}
                    className="w-1/2 rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <img
                    src={images[(index + 1) % images.length]}
                    alt={`Document ${index + 1} Right`}
                    className="w-1/2 rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
                    <button
                      onClick={() => setActiveSlide(index)}
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

      {/* MODAL using portal */}
      {activeSlide !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/70 flex flex-col items-center justify-center wow animate__animated animate__fadeIn"
            onClick={closeModal}
          >
            <button
              onClick={closeModal}
              className="fixed top-6 right-6 z-[10000] w-12 h-12 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition"
            >
              <X className="w-6 h-6 text-slate-900" />
            </button>

            <div
              className="flex w-full h-full gap-6 max-w-7xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 flex flex-col bg-white  shadow-2xl">
                <div className="sticky top-0 bg-white p-4 border-b font-semibold text-lg">
                  Original Document (Vernacular)
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={images[activeSlide]}
                      alt={`Left scroll ${i}`}
                      className="w-full mb-4 rounded-lg"
                    />
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col bg-white shadow-2xl">
                <div className="sticky top-0 bg-white p-4 border-b font-semibold text-lg">
                  Translated English Document
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i + 100}
                      src={images[(activeSlide + 1) % images.length]}
                      alt={`Right scroll ${i}`}
                      className="w-full mb-4 "
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default DocSlider;
