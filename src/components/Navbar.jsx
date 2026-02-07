import { useState, useEffect } from "react";
import Logo from "../assets/img/logo.svg";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = ["Home", "About Us", "Why Choose Us", "Legal"];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`
        m-header fixed top-0 z-50 w-full
        transition-all duration-300
        ${scrolled ? "bg-white shadow-sm" : "bg-transparent"}
      `}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center">
            <a href="/" onClick={(e) => e.preventDefault()}>
              <img
                className="w-[100px] sm:w-[100px] lg:w-[200px]"
                src={Logo}
                alt="Logo"
              />
            </a>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className="relative text-gray-900 uppercase font-semibold
                  after:absolute after:left-0 after:-bottom-1 after:h-[2px]
                  after:w-0 after:bg-blue-600 after:transition-all after:duration-300
                  hover:text-blue-600 hover:after:w-full"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
              Login
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Sign Up
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-900"
            onClick={() => setOpen(!open)}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center space-y-6 mt-10">
          {navItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="text-lg uppercase font-semibold text-gray-900 hover:text-blue-600"
              onClick={() => setOpen(false)}
            >
              {item}
            </a>
          ))}

          <div className="flex flex-col space-y-4 mt-6 w-3/4">
            <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
              Login
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
