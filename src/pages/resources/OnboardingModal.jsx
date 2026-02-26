import React, { useState } from "react";
import { X, Building2, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useApp } from "../../context/AppContext";
import {
  createOrganization,
  fetchUserProfile,
  joinOrganization,
} from "../../api/organizationApi";

const OnboardingModal = ({ canClose = false, onClose }) => {
  const [activeTab, setActiveTab] = useState("create");
  const [orgName, setOrgName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleCreateOrganization = async (e) => {
    e.preventDefault();
    setError(null);

    if (!orgName.trim()) {
      setError("Please enter an organization name");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create the organization
      await createOrganization(orgName.trim());

      // Step 2: Fetch fresh user profile with organization data
      const userData = await fetchUserProfile();

      // Step 3: Update global context
      setUser(userData);

      // Step 4: Show success and navigate to dashboard
      toast.success("Organization created successfully!");

      navigate("/dashboard/new");
    } catch (err) {
      console.error("Create organization error:", err);
      setError(err.message || "Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinOrganization = async (e) => {
    e.preventDefault();
    setError(null);

    if (!inviteCode.trim()) {
      setError("Please enter an invite code");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Join the organization
      await joinOrganization(inviteCode.trim());

      // Step 2: Fetch fresh user profile with organization data
      const userData = await fetchUserProfile();

      // Step 3: Update global context
      setUser(userData);

      // Step 4: Show success and navigate to dashboard
      toast.success("Successfully joined organization!");

      navigate("/dashboard/new");
    } catch (err) {
      console.error("Join organization error:", err);
      setError(err.message || "Failed to join organization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 px-4">
      <div className="relative bg-white/95 backdrop-blur-xl rounded-xl md:rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.25)] w-full max-w-[560px] p-5 md:p-10 border border-gray-100">
        {/* Close Button */}
        {canClose && onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl hover:bg-blue-50 transition-colors"
          >
            <X size={20} className="text-gray-500 hover:text-blue-600" />
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-[9px] font-bold tracking-[0.25em] uppercase text-blue-700 mb-4">
            Welcome Aboard
          </div>

          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
            Organization Setup
          </h2>

          <p className="text-sm text-gray-500 font-medium max-w-sm mx-auto">
            Create your own organization or join an existing one to continue
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-200 p-1.5  rounded-2xl">
          <button
            onClick={() => {
              setActiveTab("create");
              setError(null);
            }}
            disabled={loading}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center gap-2 justify-center text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === "create"
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "text-gray-500 hover:text-blue-600"
            } disabled:opacity-50`}
          >
            <Building2 size={14} className="inline mr-2" />
            Create <span className="max-md:hidden">New</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("join");
              setError(null);
            }}
            disabled={loading}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center gap-2 justify-center text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === "join"
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "text-gray-500 hover:text-blue-600"
            } disabled:opacity-50`}
          >
            <KeyRound size={14} className="inline mr-2" />
            Join <span className="max-md:hidden">Existing</span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Create Form */}
        {activeTab === "create" && (
          <form onSubmit={handleCreateOrganization} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                Organization Name
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Enter your organization name"
                disabled={loading}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all text-sm disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-4 rounded-2xl transition-all active:scale-[0.98] tracking-widest shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "CREATING..." : "CREATE ORGANIZATION"}
            </button>
          </form>
        )}

        {/* Join Form */}
        {activeTab === "join" && (
          <form onSubmit={handleJoinOrganization} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                Invite Code
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="Enter organization invite code"
                disabled={loading}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all text-sm font-mono disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-4 rounded-2xl transition-all active:scale-[0.98] tracking-widest shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "JOINING..." : "JOIN ORGANIZATION"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OnboardingModal;
