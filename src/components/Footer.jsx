import React, { useEffect } from "react";
import { Facebook, Youtube, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import WOW from "wowjs";
import FTlogo from "../assets/img/logoft.png";

const Footer = () => {
  useEffect(() => {
    new WOW.WOW({
      live: false,
    }).init();
  }, []);

  return (
    <footer className="w-full min-h-screen bg-black flex flex-col justify-between py-16">
      <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center flex-1">

        {/* Logo */}
        <div className="wow animate__animated animate__fadeInUp">
          <img
            src={FTlogo}
            alt="Footer Logo"
            className="mb-10 ft-logo mx-auto"
          />
        </div>

        {/* Social Icons */}
        <div className="flex gap-5 mb-12 wow animate__animated animate__fadeInUp animate__delay-1s">
          <a
            href="#"
            className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
          >
            <Facebook size={18} />
          </a>

          <a
            href="#"
            className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
          >
            <Youtube size={18} />
          </a>

          <a
            href="#"
            className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
          >
            <Instagram size={18} />
          </a>
        </div>

        {/* Top HR */}
        <div className="w-32 border-t border-gray-700 mb-8 wow animate__animated animate__fadeIn animate__delay-2s"></div>

        {/* Links (Same as Navbar) */}
        <nav className="flex gap-4 lg:gap-10 text-sm text-gray-400 mb-8 wow animate__animated animate__fadeInUp animate__delay-2s">
          <Link to="/about" className="hover:text-white transition">
            About Us
          </Link>
          <Link to="/why-choose-us" className="hover:text-white transition">
            Why Choose Us
          </Link>
          <Link to="/help" className="hover:text-white transition">
            Help Center
          </Link>
          <Link to="/legal" className="hover:text-white transition">
            Legal
          </Link>
        </nav>

        {/* Bottom HR */}
        <div className="w-32 border-t border-gray-700 wow animate__animated animate__fadeIn animate__delay-3s"></div>

      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-gray-500 wow animate__animated animate__fadeIn animate__delay-3s">
        Copyright © 2026. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
