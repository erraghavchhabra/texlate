import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import { Building2, KeyRound } from "lucide-react";
import OrganizationModal from "./OrganizationModal"; // ✅ import modal

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  // Welcome modal
  const [showModal, setShowModal] = useState(true);
  const [activeTab, setActiveTab] = useState("create");

  // ✅ Edit Organization modal state (THIS WAS MISSING)
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (showModal || editOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal, editOpen]);

  return (
    <div className="dashboard-shell font-dashboard relative min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* ✅ Pass handler to Sidebar */}
      <Sidebar
        open={open}
        setOpen={setOpen}
        onEditOrganization={() => setEditOpen(true)}
      />

      <div className="dashboard-main">
        <Topbar setOpen={setOpen} />

        <div className="dashboard-content p-4 sm:p-6">
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
            <Outlet />
          </div>
        </div>
      </div>

      {/* ================= Welcome Modal ================= */}
      {showModal && (
        <div className="fixed hidden inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-fadeIn relative">
            <div className="flex justify-center mb-4">
              <span className="px-4 py-1.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-600 shadow-sm">
                ✨ Welcome Aboard
              </span>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
              Organization Setup
            </h2>

            <p className="text-center text-gray-500 text-sm mb-8">
              Create your own organization or join an existing one to continue
            </p>

            <div className="flex bg-blue-50 rounded-2xl p-1.5 mb-6 relative">
              <button
                onClick={() => setActiveTab("create")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${
                  activeTab === "create"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-blue-500"
                }`}
              >
                <Building2 size={16} /> Create New
              </button>

              <button
                onClick={() => setActiveTab("join")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${
                  activeTab === "join"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-blue-500"
                }`}
              >
                <KeyRound size={16} /> Join Existing
              </button>
            </div>

            <input
              type="text"
              placeholder="Enter organization name"
              className="w-full border border-gray-200 rounded-xl p-3 mb-4"
            />

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ================= Edit Organization Modal ================= */}
      <OrganizationModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />

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
