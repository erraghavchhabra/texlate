import {
  Menu,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar({ setOpen }) {
  const [dropdown, setDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  /* Close dropdown on outside click */
  useEffect(() => {
    const close = (e) => !ref.current?.contains(e.target) && setDropdown(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  /* Add shadow when scrolling */
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 lg:left-[260px] left-0 z-30
      backdrop-blur-xl bg-white/80 border-b border-slate-200/70
      transition-all duration-300 ${scrolled ? "shadow-sm" : ""}`}
    >
      <div className="h-[64px] px-4 sm:px-6 flex items-center">
        {/* Mobile Toggle */}
        <button
          className="lg:hidden mr-3 p-2 rounded-lg hover:bg-slate-100 transition"
          onClick={() => setOpen((p) => !p)}
        >
          <Menu size={22} />
        </button>

        {/* Status */}
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>

          <p className="text-sm font-semibold tracking-wide text-slate-700">
            MANISH SAINI
          </p>
        </div>

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-6" ref={ref}>
          {/* Credit */}
          <div className="hidden sm:block text-right">
            <p className="text-[11px] text-slate-400 uppercase tracking-wider">
              Available Credit
            </p>
            <p className="text-sm font-semibold text-slate-700">0 Pages</p>
          </div>

          {/* Profile */}
          <button
            onClick={() => setDropdown(!dropdown)}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
              MS
            </div>

            <ChevronDown
              size={16}
              className={`text-slate-500 transition-transform duration-300 ${
                dropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown → ONLY LOGOUT */}
          <div
            className={`absolute right-6 top-[70px] w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-3 origin-top-right transition-all duration-200 ${
              dropdown
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}
          >
            <MenuItem
              icon={<LogOut size={16} />}
              label="Logout Account"
              danger
              onClick={() => {
                setDropdown(false);
                navigate("/login"); // change if needed
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuItem({ icon, label, danger, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-5 py-2.5 text-sm transition-all duration-200
      ${
        danger
          ? "text-red-500 hover:bg-red-50"
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
