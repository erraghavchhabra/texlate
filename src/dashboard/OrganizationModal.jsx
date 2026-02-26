import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import {
  fetchUserProfile,
  updateOrganizationName,
} from "../api/organizationApi";
import toast from "react-hot-toast";

export default function OrganizationModal({ open, onClose }) {
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUser, user } = useApp();
  const currentOrgName = user?.organization?.name;
  const orgId = user?.organization?.org_id;
  console.log(6516151, user);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setOrgName(currentOrgName);
      setError(null);
    }
  }, [open, currentOrgName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!orgName.trim()) {
      setError("Please enter an organization name");
      return;
    }

    if (orgName.trim() === currentOrgName) {
      setError("Please enter a different name");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Update the organization name
      await updateOrganizationName(orgId, orgName.trim());

      // Step 2: Fetch fresh user profile with updated organization data
      const userData = await fetchUserProfile();

      // Step 3: Update global context
      setUser(userData);

      // Step 4: Show success toast
      toast.success("Organization name updated successfully!");

      // Step 5: Close modal
      onClose();
    } catch (err) {
      console.error("Update organization name error:", err);
      setError(err.message || "Failed to update organization name");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
      />

      {/* Modal */}
      <form
        onSubmit={handleSubmit}
        className="relative bg-white w-full max-w-lg mx-4 rounded-3xl shadow-2xl p-8 animate-scaleIn"
      >
        <button
          onClick={onClose}
          type="button"
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
          disabled={loading}
          value={orgName}
          autoFocus
          onChange={(e) => setOrgName(e.target.value)}
          className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
        />

        <button
          disabled={loading}
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:scale-[1.01] transition"
        >
          {loading ? "UPDATING..." : "UPDATE ORGANIZATION"}
        </button>
      </form>
    </div>
  );
}
