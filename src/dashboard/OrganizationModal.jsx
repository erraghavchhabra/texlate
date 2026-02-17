import { X } from "lucide-react";
import { useState } from "react";

export default function OrganizationModal({ open, onClose }) {
  const [name, setName] = useState("manish saini");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg mx-4 rounded-3xl shadow-2xl p-8 animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-700"
        >
          <X size={20} />
        </button>

        <p className="text-xs tracking-[0.25em] text-slate-400 mb-3">
          ORGANIZATION SETTINGS
        </p>

        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Edit Organization Name
        </h2>

        <p className="text-slate-500 mb-6">
          Update the name of your organization
        </p>

        <label className="text-xs font-semibold text-slate-500">
          ORGANIZATION NAME
        </label>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
        />

        <button className="mt-6 w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:scale-[1.01] transition">
          UPDATE ORGANIZATION
        </button>
      </div>
    </div>
  );
}
