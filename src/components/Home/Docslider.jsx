import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ZoomIn, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "swiper/css";
import "swiper/css/navigation";

import Img1 from "../../assets/img/doc-1.jpg";
import Img2 from "../../assets/img/doc-1.jpg";
import Img3 from "../../assets/img/doc-1.jpg";
import Img4 from "../../assets/img/doc-1.jpg";

gsap.registerPlugin(ScrollTrigger);

const images = [Img1, Img2, Img3, Img4];

const DocSlider = () => {
  const sectionRef = useRef(null);
  const modalRef = useRef(null);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current.querySelectorAll(".doc-slide"),
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      }
    );
  }, []);

  useEffect(() => {
    if (activeImage && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" }
      );
    }
  }, [activeImage]);

  const closeModal = () => {
    if (!modalRef.current) return;

    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.96,
      duration: 0.25,
      ease: "power3.in",
      onComplete: () => setActiveImage(null),
    });
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="w-full py-20 relative bg-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 relative">

          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1.1}
            centeredSlides
            navigation={{
              nextEl: ".doc-next",
              prevEl: ".doc-prev",
            }}
            breakpoints={{
              768: {
                slidesPerView: 3,
                centeredSlides: false,
              },
            }}
          >
            {images.map((img, index) => (
              <SwiperSlide key={index} className="doc-slide">
                <div className="relative group overflow-hidden rounded-xl">

                  <img
                    src={img}
                    alt={`Document ${index + 1}`}
                    className="w-full transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

          {/* Navigation */}
          <button className="doc-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition">
            ‹
          </button>
          <button className="doc-next absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition">
            ›
          </button>

        </div>
      </section>

      {/* MODAL */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-6"
          onClick={closeModal}
        >
          {/* Close button — TOP RIGHT */}
          <button
            onClick={closeModal}
            className="
              fixed top-6 right-6 z-50
              w-12 h-12
              rounded-full
              bg-white/90
              flex items-center justify-center
              hover:scale-110
              transition
            "
          >
            <X className="w-6 h-6 text-slate-900" />
          </button>

          {/* Image */}
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage}
              alt="Zoomed document"
              className="
                max-h-[85vh]
                max-w-[85vw]
                object-contain
                rounded-2xl
                shadow-2xl
                bg-white
                p-3
              "
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DocSlider;
