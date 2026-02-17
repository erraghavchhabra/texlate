import { FileText, History } from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/img/logoft.png";

export default function Sidebar({ open, setOpen }) {
  const base =
    "group relative flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium transition-all duration-300";

  return (
    <>
      {/* Mobile Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full w-[260px]
  bg-gradient-to-b from-white to-slate-50
  border-r border-slate-200/70
  shadow-[0_0_40px_rgba(0,0,0,0.04)]
  transition-transform duration-300 ease-out
  ${open ? "translate-x-0" : "-translate-x-full"}
  lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-slate-200/70">
          <img src={Logo} alt="logo" className="h-10 object-contain" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLink
            to="/dashboard/new"
            className={({ isActive }) =>
              `${base} ${isActive
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 hover:bg-white hover:shadow-sm"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator */}
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1.5 rounded-r-md bg-blue-600 transition-all duration-300 ${isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50"
                    }`}
                />

                <FileText
                  size={18}
                  className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                />
                Start New Translation
              </>
            )}
          </NavLink>

          <NavLink
            to="/dashboard/history"
            className={({ isActive }) =>
              `${base} ${isActive
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 hover:bg-white hover:shadow-sm"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1.5 rounded-r-md bg-blue-600 transition-all duration-300 ${isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50"
                    }`}
                />

                <History
                  size={18}
                  className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                />
                History
              </>
            )}
          </NavLink>
        </nav>

       
      </aside>
    </>
  );
}
