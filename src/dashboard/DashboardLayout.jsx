import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import { Building2, KeyRound } from "lucide-react";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [activeTab, setActiveTab] = useState("create");

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal]);

  return (
    <div className="dashboard-shell font-dashboard relative min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* Main content */}
      <div className="dashboard-main">
        <Topbar setOpen={setOpen} />

        <div className="dashboard-content p-4 sm:p-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed hidden inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-fadeIn relative">

            {/* Cute Pill */}
            <div className="flex justify-center mb-4">
              <span className="px-4 py-1.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-600 shadow-sm">
                ✨ Welcome Aboard
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
              Organization Setup
            </h2>

            <p className="text-center text-gray-500 text-sm mb-8">
              Create your own organization or join an existing one to continue
            </p>

            {/* Tabs */}
            <div className="flex bg-blue-50 rounded-2xl p-1.5 mb-6 relative">
              <button
                onClick={() => setActiveTab("create")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === "create"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-blue-500 hover:text-blue-600"
                }`}
              >
                <Building2 size={16} />
                Create New
              </button>

              <button
                onClick={() => setActiveTab("join")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === "join"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-blue-500 hover:text-blue-600"
                }`}
              >
                <KeyRound size={16} />
                Join Existing
              </button>
            </div>

            {/* Content */}
            {activeTab === "create" ? (
              <>
                <input
                  type="text"
                  placeholder="Enter organization name"
                  className="w-full border border-gray-200 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
                >
                  Create Organization
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter invite code or organization ID"
                  className="w-full border border-gray-200 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
                >
                  Join Organization
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }

          .animate-fadeIn {
            animation: fadeIn 0.25s ease-out;
          }
        `}
      </style>
    </div>
  );
}
