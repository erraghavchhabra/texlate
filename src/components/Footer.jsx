import React from "react";
import { Facebook, Youtube, Instagram } from "lucide-react";
import FTlogo from "../assets/img/logoft.png";

const Footer = () => {
  return (
    <footer className="w-full bg-black pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top Row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">

          {/* Left: Logo + Policies */}
          <div>
            <img
              src={FTlogo}
              alt="Footer Logo"
              className="ft-logo mb-6"
            />

            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition">
                Policy
              </a>
            </div>
          </div>

          {/* Right: Social + Nav */}
          <div className="flex flex-col items-start md:items-end gap-10">

            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white hover:opacity-90 transition"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-red-600 flex items-center justify-center text-white hover:opacity-90 transition"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-full bg-pink-600 flex items-center justify-center text-white hover:opacity-90 transition"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>

            {/* Navigation */}
            <nav className="flex gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition">
                Home
              </a>
              <a href="#" className="hover:text-white transition">
                About Us
              </a>
              <a href="#" className="hover:text-white transition">
                Legal
              </a>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8" />

        {/* Bottom */}
        <p className="text-center text-sm text-gray-500">
          Copyright 2026. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
