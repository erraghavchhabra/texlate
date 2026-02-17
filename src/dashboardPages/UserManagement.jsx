import { ShieldCheck, Copy, Mail, Calendar } from "lucide-react";
import { useState } from "react";

export default function UserManagement() {
  const [copied, setCopied] = useState(false);

  const inviteCode = "2J6OI4XM7";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition w-full sm:w-auto"
        >
          <Copy size={16} className="text-blue-600" />
          <span className="text-sm font-semibold text-slate-700">
            {copied ? "Copied!" : "Copy Code"}
          </span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 bg-slate-50 px-6 py-4 text-xs font-semibold tracking-wider text-slate-500 uppercase">
          <div className="col-span-5">Member</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-3">Joined</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Row */}
        <div className="grid grid-cols-12 items-center px-6 py-5 border-t hover:bg-blue-50/40 transition">
          <MemberInfo />
          <Role />
          <Joined />
          <Protected />
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-semibold">
              MS
            </div>

            <div>
              <p className="font-semibold text-slate-800">
                manish saini <span className="text-blue-500 text-xs">(You)</span>
              </p>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <Mail size={14} /> manishsaini7501@gmail.com
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
              ADMIN
            </span>

            <span className="text-slate-500 flex items-center gap-1">
              <Calendar size={14} /> Feb 16, 2026
            </span>
          </div>

          <div className="mt-3 text-right">
            <span className="text-xs font-semibold text-slate-400 tracking-wider">
              PROTECTED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Desktop Components (keeps code clean) */

function MemberInfo() {
  return (
    <div className="col-span-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-semibold">
        MS
      </div>

      <div>
        <p className="font-semibold text-slate-800">
          manish saini <span className="text-blue-500 text-xs">(You)</span>
        </p>
        <p className="text-sm text-slate-500 flex items-center gap-1">
          <Mail size={14} />
          manishsaini7501@gmail.com
        </p>
      </div>
    </div>
  );
}

function Role() {
  return (
    <div className="col-span-2">
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-600 text-white">
        ADMIN
      </span>
    </div>
  );
}

function Joined() {
  return (
    <div className="col-span-3 text-sm text-slate-600 flex items-center gap-2">
      <Calendar size={15} />
      Feb 16, 2026
    </div>
  );
}

function Protected() {
  return (
    <div className="col-span-2 text-right">
      <span className="text-xs font-semibold text-slate-400 tracking-wider">
        PROTECTED
      </span>
    </div>
  );
}
