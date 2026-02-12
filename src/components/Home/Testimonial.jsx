import React, { useRef, useEffect } from "react";
import WOW from "wowjs";
import "animate.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const testimonials = [
  {
    name: "Mark Parker",
    role: "Co-Founder of Design Ocean",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=400",
    text: "I was looking for a perfect payment solution for my freelance business. I'm using Payola as my primary payment method and I will recommend everyone who needs a best payment solution.",
  },
  {
    name: "Sarah Johnson",
    role: "Legal Consultant",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400",
    text: "Texlate saved us countless hours. The accuracy and formatting quality are unmatched for legal translations.",
  },
];

const Testimonials = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    new WOW.WOW({ live: false }).init();
  }, []);

  return (
    <section className="h-screen w-full py-28">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-slate-900 big-h wow animate__animated animate__fadeInDown">
            What Our Customer Says
          </h2>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          className="relative"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* LEFT IMAGE */}
                <div
                  className="flex justify-center wow animate__animated animate__zoomIn"
                  data-wow-delay="0.2s"
                >
                  <div className="relative">
                    <div className="absolute -top-2 -right-6 text-5xl lg:text-[100px] text-blue-100 wow animate__animated animate__fadeIn">
                      “
                    </div>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-64 h-64 rounded-full object-cover ring-4 ring-blue-100"
                    />
                  </div>
                </div>

                {/* RIGHT CONTENT */}
                <div
                  className="wow animate__animated animate__fadeInRight"
                  data-wow-delay="0.4s"
                >
                  <p className="text-lg text-blue-900 font-semibold leading-relaxed mb-6">
                    “{item.text}”
                  </p>

                  <div
                    className="wow animate__animated animate__zoomIn"
                    data-wow-delay="0.6s"
                  >
                    <h4 className="font-semibold text-2xl text-slate-900">
                      {item.name}
                    </h4>
                    <p className="text-sm text-blue-600">{item.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Navigation Buttons */}
          <div
            className="flex justify-end gap-4 mt-10 wow animate__animated animate__fadeInUp"
            data-wow-delay="0.5s"
          >
            <button
              ref={prevRef}
              className="w-12 h-12 rounded-full border border-blue-300 text-blue-600 flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition"
            >
              ←
            </button>

            <button
              ref={nextRef}
              className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition"
            >
              →
            </button>
          </div>
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
