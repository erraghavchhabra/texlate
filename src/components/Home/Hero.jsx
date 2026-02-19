import React, { useEffect } from "react";
import WOW from "wowjs";
import Hbg from "../../assets/img/h-bg.svg";
import HTop from "../../assets/img/h-top.png";
import { Link } from "react-router-dom";
const Hero = () => {
  useEffect(() => {
    const wow = new WOW.WOW({
      live: false,
    });
    wow.init();
  }, []);

  return (
    <section className="hero lg:h-screen w-full relative pt-16 lg:pt-18 min-h-[100vh] flex flex-col justify-center">
      <div className="max-w-7xl w-full flex flex-col lg:flex-row justify-between items-center p-6 mx-auto sm:py-12 lg:py-18">

        {/* LEFT CONTENT */}
        <div className="flex z-10 flex-col justify-center text-center lg:text-left lg:basis-3/5 xl:basis-3/6">

          {/* Heading */}
          <h1 className="wow animate__animated animate__fadeInUp text-4xl sm:text-5xl lg:text-7xl font-medium mb-2 lg:mb-4 leading-tight">
            PDF Document <br />
            <span className="text-blue-600">Translator</span>
          </h1>

          {/* Subtitle */}
          <h2
            className="wow animate__animated animate__fadeInUp text-2xl italic text-gray-800"
            data-wow-delay="0.2s"
          >
            Vernacular & Legal Documents to English
          </h2>

          {/* Paragraph */}
          <p
            className="wow animate__animated animate__fadeInUp mt-6 mb-8 text-lg w-full lg:w-[70%] sm:mb-12 text-gray-700"
            data-wow-delay="0.4s"
          >
            Secure AI translation of legal and government PDFs into English,
            preserving original layout and accuracy.
          </p>

          {/* Buttons */}
          <div
            className="wow animate__animated animate__fadeInUp flex flex-col space-y-4 sm:flex-row justify-center mb-0 sm:mb-16 lg:mb-0 lg:justify-start sm:space-y-0 sm:space-x-4"
            data-wow-delay="0.6s"
          >
            <Link
              to="/upload"
              className="px-8 py-3 text-[15px] font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition inline-block"
            >
              Upload & Translate
            </Link>

            <a
              href="#"
              className="px-8 py-3 text-[15px] font-semibold border border-gray-300 rounded-xl hover:bg-gray-100 transition"
            >
              View Plans
            </a>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="wow animate__animated animate__fadeInRight flex items-center justify-center p-2 lg:p-6 lg:mt-0 lg:basis-3/6 relative">
          <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center">
            <img src={Hbg} alt="hero background" className="absolute" />
            <img src={HTop} alt="hero top" className="relative rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
