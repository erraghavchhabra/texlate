import {
  ShieldCheck,
  Copy,
  Mail,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Trash2,
} from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import apiClient from "../api/apiClient";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";
import { useMediaQuery } from "../utils/useMediaQuery";
class MembersAPI {
  static async getMembers(page = 1, pageSize = 20) {
    const response = await apiClient.get(
      `/organizations/members?page=${page}&page_size=${pageSize}`,
    );
    return response.data;
  }

  static async removeMember(firebaseUid) {
    await apiClient.post("/organizations/members/remove", {
      firebase_uid: firebaseUid,
    });
  }
}

// ============================================================================
// Utility: Get Initials
// ============================================================================

const getInitials = (name) => {
  if (!name || name.trim() === "") return "??";

  return (
    name
      .trim()
      .split(" ")
      .filter((word) => word.length > 0)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??"
  );
};

export default function UserManagement() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [copied, setCopied] = useState(false);

  // const inviteCode = "2J6OI4XM7";

  // const handleCopy = async () => {
  //   await navigator.clipboard.writeText(inviteCode);
  //   setCopied(true);
  //   setTimeout(() => setCopied(false), 2000);
  // };
  const { user } = useApp();
  const scope = useRef - null;

  // ============================================================================
  // State Management
  // ============================================================================

  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const pageSize = 20;

  // Currently deleting member (for optimistic UI)
  const [deletingUid, setDeletingUid] = useState(null);

  // ============================================================================
  // Data Fetching
  // ============================================================================

  const fetchMembers = useCallback(async (page) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await MembersAPI.getMembers(page, pageSize);
      setMembers(data.members);
      setTotalMembers(data.total);
      setHasNext(data.has_next);
      setHasPrevious(data.has_previous);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load members";
      setError(errorMessage);
      toast.error(errorMessage, {
        style: {
          background: "#DC2626",
          color: "#fff",
          fontSize: "11px",
          fontWeight: "bold",
          borderRadius: "12px",
          padding: "12px 20px",
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load members on mount
  useLayoutEffect(() => {
    fetchMembers(1);
  }, [fetchMembers]);

  // ============================================================================
  // GSAP Animations (only when data loads)
  // ============================================================================

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const copyInviteCode = () => {
    const inviteCode = user?.organization?.invite_code;
    if (!inviteCode) return;

    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemoveMember = async (member) => {
    // Prevent admin from removing themselves
    if (member.firebase_uid === user?.uid) {
      toast.error("You cannot remove yourself", {
        style: {
          background: "#DC2626",
          color: "#fff",
          fontSize: "11px",
          fontWeight: "bold",
          borderRadius: "12px",
          padding: "12px 20px",
        },
      });
      return;
    }

    // Optimistic update: remove from UI immediately
    setDeletingUid(member.firebase_uid);
    const originalMembers = [...members];
    const originalTotal = totalMembers;

    setMembers((prev) =>
      prev.filter((m) => m.firebase_uid !== member.firebase_uid),
    );
    setTotalMembers((prev) => prev - 1);

    try {
      await MembersAPI.removeMember(member.firebase_uid);

      toast.success(
        member.display_name
          ? `Removed ${member.display_name}`
          : "Removed successfully",
        {
          style: {
            background: "#000",
            color: "#fff",
            fontSize: "11px",
            fontWeight: "bold",
            borderRadius: "12px",
            padding: "12px 20px",
          },
        },
      );

      // If current page is now empty and we're not on page 1, go back
      if (members.length === 1 && currentPage > 1) {
        fetchMembers(currentPage - 1);
      }
    } catch (err) {
      // Rollback on error
      setMembers(originalMembers);
      setTotalMembers(originalTotal);

      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove member";
      toast.error(errorMessage, {
        style: {
          background: "#DC2626",
          color: "#fff",
          fontSize: "11px",
          fontWeight: "bold",
          borderRadius: "12px",
          padding: "12px 20px",
        },
      });
    } finally {
      setDeletingUid(null);
    }
  };

  const handlePageChange = (newPage) => {
    fetchMembers(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMemberAdded = () => {
    // Refresh current page when new member is added
    fetchMembers(currentPage);
  };

  // ============================================================================
  // Render Helpers
  // ============================================================================

  const inviteCode = user?.organization?.invite_code || "Loading...";
  const currentUserRole = user?.role;
  const isAdmin = currentUserRole === "admin";

  const totalPages = Math.ceil(totalMembers / pageSize);

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div>
        <p className="text-xs tracking-[0.25em] text-blue-500 font-semibold uppercase">
          Access Management
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">
          Team & Access
        </h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">
          Manage team members, roles, and access permissions.
        </p>
      </div>

      {/* Invite Card */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>

          <div>
            <p className="text-xs tracking-[0.3em] text-slate-400 font-semibold uppercase">
              Your Invite Code
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-slate-800">
              {inviteCode}
            </h2>
            <span className="text-xs sm:text-sm text-slate-500">
              Share with others to invite them
            </span>
          </div>
        </div>

        <button
          onClick={copyInviteCode}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition w-full sm:w-auto"
        >
          <Copy size={16} className="text-blue-600" />
          <span className="text-sm font-semibold text-slate-700">
            {copied ? "Copied!" : "Copy Code"}
          </span>
        </button>
      </div>

      {/* MEMBERS TABLE */}
      <div className="relative  bg-white border border-slate-200 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Error State */}
        {error && (
          <div className="p-12 text-center">
            <p className="text-red-600 font-bold mb-4">{error}</p>
            <button
              onClick={() => fetchMembers(currentPage)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="p-16 flex flex-col items-center justify-center text-center bg-gradient-to-b from-gray-50 to-white rounded-2xl">
            {/* Loader Circle */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-gray-200 blur-xl opacity-40 animate-pulse"></div>
              <div className="relative w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100">
                <Loader2 className="animate-spin text-blue-600" size={34} />
              </div>
            </div>

            {/* Text (Same Content) */}
            <p className="text-blue-500 text-sm font-bold uppercase tracking-widest">
              Loading members...
            </p>
          </div>
        )}

        {/* Table */}
        {!isLoading &&
          !error &&
          (!isMobile ? (
            <>
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10">
                  <tr className="text-left">
                    {["Member", "Role", "Joined", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-4 sm:px-6 py-4  text-xs font-semibold tracking-wider text-slate-500 uppercase last:text-end"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {members.map((member) => {
                    const isCurrentUser = member.firebase_uid === user?.uid;
                    const isBeingDeleted = deletingUid === member.firebase_uid;

                    return (
                      <tr
                        key={member.firebase_uid}
                        className={`member-row group transition-all ${isBeingDeleted ? "opacity-50" : "hover:bg-gray-50/50"}`}
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-semibold">
                              {getInitials(member.display_name)}
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-gray-900 leading-none mb-1">
                                {member.display_name ||
                                  member.email ||
                                  "Unknown User"}
                                {isCurrentUser && (
                                  <span className="ml-2 text-[9px] text-blue-600 font-black uppercase tracking-wider">
                                    (You)
                                  </span>
                                )}
                              </p>

                              <p className="text-sm text-slate-500 flex items-center gap-1">
                                <Mail size={14} />
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                              member.role === "admin"
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-500 border-gray-200"
                            }`}
                          >
                            {member.role}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <p className="col-span-3 text-sm text-slate-600 flex items-center gap-2">
                            <Calendar size={15} />
                            {new Date(member.joined_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </td>
                        <td className="px-8 py-6 text-right">
                          {isAdmin &&
                          !isCurrentUser &&
                          member.role !== "admin" ? (
                            <button
                              onClick={() => handleRemoveMember(member)}
                              disabled={isBeingDeleted}
                              className="p-3 text-gray-600 hover:text-red-800 hover:bg-white hover:shadow-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isBeingDeleted ? (
                                <Loader2 className="animate-spin" size={16} />
                              ) : (
                                <Trash2 size={16} strokeWidth={1.5} />
                              )}
                            </button>
                          ) : member.role === "admin" ? (
                            <span className="text-[10px]   uppercase   border-gray-400  text-xs font-semibold text-slate-400 tracking-wider">
                              Protected
                            </span>
                          ) : (
                            <span className="text-[10px]   uppercase   border-gray-400  text-xs font-semibold text-slate-400 tracking-wider">
                              No Access
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-8 py-6 border-t border-gray-100 bg-gray-50/30">
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                    Page {currentPage} of {totalPages} • {totalMembers} total
                    members
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPrevious}
                      className="p-2 rounded-xl border border-gray-200 hover:bg-white hover:border-black transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-200"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNext}
                      className="p-2 rounded-xl border border-gray-200 hover:bg-white hover:border-black transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-200"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-2">
              <div className="divide-y divide-gray-50">
                {members.map((member) => {
                  const isCurrentUser = member.firebase_uid === user?.uid;
                  const isBeingDeleted = deletingUid === member.firebase_uid;
                  return (
                    <div
                      className="md:hidden space-y-4"
                      key={member.firebase_uid}
                    >
                      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-semibold">
                            {getInitials(member.display_name)}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {member.display_name ||
                                member.email ||
                                "Unknown User"}
                              {isCurrentUser && (
                                <span className="text-blue-500 text-xs">
                                  (You)
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-slate-500 flex items-center gap-1">
                              <Mail size={14} /> {member.email}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-sm">
                          <span
                            className={`px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold uppercase ${
                              member.role === "admin"
                                ? "bg-blue-600 text-white "
                                : "bg-white text-gray-500 "
                            }`}
                          >
                            {member.role}
                          </span>

                          <span className="text-slate-500 flex items-center gap-1">
                            <Calendar size={14} />{" "}
                            {new Date(member.joined_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>

                        <div className="mt-3 text-right">
                          <div className=" text-right">
                            {isAdmin &&
                            !isCurrentUser &&
                            member.role !== "admin" ? (
                              <button
                                onClick={() => handleRemoveMember(member)}
                                disabled={isBeingDeleted}
                                className="p-3 text-gray-600 hover:text-red-800 hover:bg-white hover:shadow-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isBeingDeleted ? (
                                  <Loader2 className="animate-spin" size={16} />
                                ) : (
                                  <Trash2 size={16} strokeWidth={1.5} />
                                )}
                              </button>
                            ) : member.role === "admin" ? (
                              <span className="text-[10px]   uppercase   border-gray-400  text-xs font-semibold text-slate-400 tracking-wider">
                                Protected
                              </span>
                            ) : (
                              <span className="text-[10px]   uppercase   border-gray-400  text-xs font-semibold text-slate-400 tracking-wider">
                                No Access
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Pagination */}
              {totalPages >= 1 && (
                <div className="flex items-center justify-between px-3 py-1 rounded-xl bg-gray-100 mt-2">
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                    Page {currentPage} of {totalPages} • {totalMembers} total
                    members
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPrevious}
                      className="p-2 rounded-xl border bg-white border-gray-200 hover:bg-white hover:border-black transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-200"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNext}
                      className="p-2 rounded-xl border bg-white border-gray-200 hover:bg-white hover:border-black transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-200"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
