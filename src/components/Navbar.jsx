import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Logo from "../assets/img/logo.svg";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About Us", link: "/about" },
    { name: "Why Choose Us", link: "/why-choose-us" },
  ];

  const legalItems = [
    { name: "Privacy Policy", link: "/privacy-policy" },
    { name: "Refund Policy", link: "/refund-policy" },
    { name: "Terms & Conditions", link: "/terms" },
    { name: "Disclaimer", link: "/disclaimer" },
  ];

  /* Navbar shadow on scroll */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Scroll progress */
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setProgress((scrollTop / docHeight) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full backdrop-blur-md transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm" : "bg-white"
      }`}
    >
      {/* Scroll Progress Bar */}
      <div className="md:hidden absolute top-full left-0 w-full h-[2px]">
        <div
          className="h-full bg-blue-600 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/">
            <img src={Logo} className="w-[120px] lg:w-[180px]" alt="Logo" />
          </Link>

          {/* ================= DESKTOP MENU ================= */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="relative text-gray-900 uppercase font-semibold
                after:absolute after:left-0 after:-bottom-1 after:h-[2px]
                after:w-0 after:bg-blue-600 after:transition-all after:duration-300
                hover:text-blue-600 hover:after:w-full"
              >
                {item.name}
              </Link>
            ))}

            {/* LEGAL DROPDOWN */}
            <div
              className="relative group"
              onMouseEnter={() => setLegalOpen(true)}
              onMouseLeave={() => setLegalOpen(false)}
            >
              {/* Trigger */}
              <button
                className="flex items-center gap-1 relative text-gray-900 uppercase font-semibold
                after:absolute after:left-0 after:-bottom-1 after:h-[2px]
                after:w-0 after:bg-blue-600 after:transition-all after:duration-300
                group-hover:text-blue-600 group-hover:after:w-full"
              >
                Legal
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    legalOpen ? "rotate-180 text-blue-600" : ""
                  }`}
                />
              </button>

              {/* Hover Bridge (fixes gap issue) */}
              <div className="absolute top-full left-0 w-full h-3"></div>

              {/* Dropdown */}
              <div
                className={`absolute top-full left-0 w-64 rounded-xl border border-blue-100 bg-white shadow-xl
                transition-all duration-300 origin-top ${
                  legalOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="py-3">
                  {legalItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.link}
                      className="block px-5 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex space-x-4">
            <Link
              to="/login"
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center space-y-6 mt-10">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="text-lg uppercase font-semibold text-gray-900 hover:text-blue-600"
              onClick={() => setOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile Legal Accordion */}
          <div className="w-full text-center">
            <button
              onClick={() => setLegalOpen(!legalOpen)}
              className="flex items-center justify-center gap-1 text-lg uppercase font-semibold text-gray-900 hover:text-blue-600 w-full"
            >
              Legal
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${
                  legalOpen ? "rotate-180 text-blue-600" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                legalOpen ? "max-h-60 mt-4" : "max-h-0"
              }`}
            >
              <div className="flex flex-col space-y-3">
                {legalItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className="text-gray-600 hover:text-blue-600"
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Buttons */}
          <div className="flex flex-col space-y-4 mt-6 w-3/4">
            <Link
              to="/login"
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-center"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
              onClick={() => setOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
