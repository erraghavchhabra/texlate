import {
  FileText,
  History,
  Users,
  Pencil,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import Logo from "../assets/img/logoft.png";

export default function Sidebar({ open, setOpen, onEditOrganization }) {
  const navigate = useNavigate();
  const location = useLocation();

  const base =
    "group relative flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium transition-all duration-300";

  const activeStyle = "bg-blue-600 text-white shadow-md shadow-blue-200";

  const inactiveStyle =
    "text-slate-600 hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-200";

  return (
    <>
      {/* Mobile Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
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
          <Link to="/">
            <img src={Logo} alt="logo" className="h-10 object-contain" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Start New */}
          <NavLink
            to="/dashboard/new"
            className={({ isActive }) =>
              `${base} ${isActive ? activeStyle : inactiveStyle}`
            }
          >
            {({ isActive }) => (
              <>
                <ActiveBar show={isActive} />
                <FileText
                  size={18}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                Start New Translation
              </>
            )}
          </NavLink>

          {/* History */}
          <NavLink
            to="/dashboard/history"
            className={({ isActive }) =>
              `${base} ${isActive ? activeStyle : inactiveStyle}`
            }
          >
            {({ isActive }) => (
              <>
                <ActiveBar show={isActive} />
                <History
                  size={18}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                History
              </>
            )}
          </NavLink>

          {/* ================= Account Section ================= */}
          <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
            <p className="px-5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Account
            </p>

            <button
              onClick={() => navigate("/dashboard/users-management")}
              className={`${base} ${
                location.pathname === "/dashboard/users-management"
                  ? activeStyle
                  : inactiveStyle
              } w-full`}
            >
              <ActiveBar
                show={location.pathname === "/dashboard/users-management"}
              />
              <Users
                size={18}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              User Management
            </button>

            <button
              onClick={() => {
                onEditOrganization();
                setOpen(false);
              }}
              className={`${base} ${inactiveStyle} w-full`}
            >
              <Pencil
                size={18}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              Edit Organization
            </button>

            <button
              onClick={() => navigate("/dashboard/wallet")}
              className={`${base} ${
                location.pathname === "/dashboard/wallet"
                  ? activeStyle
                  : inactiveStyle
              } w-full`}
            >
              <ActiveBar show={location.pathname === "/dashboard/wallet"} />
              <CreditCard
                size={18}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              Recharge / Top-Up
            </button>
          </div>

          {/* ================= Back to Home ================= */}
          <div className="pt-4 mt-4 border-t border-slate-200">
            <button
              onClick={() => navigate("/")}
              className={`${base} ${
                location.pathname === "/" ? activeStyle : inactiveStyle
              } w-full`}
            >
              <ActiveBar show={location.pathname === "/"} />
              <ArrowLeft
                size={18}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              Back to Home
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}

/* Left Active Indicator Bar */
function ActiveBar({ show }) {
  return (
    <span
      className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1.5 rounded-r-md bg-blue-600 transition-all duration-300 ${
        show ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50"
      }`}
    />
  );
}
