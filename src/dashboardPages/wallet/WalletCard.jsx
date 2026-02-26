import React, { useLayoutEffect, useRef } from "react";
import { Calendar, Database, ArrowUpRight, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { useApp } from "../../context/AppContext";

const WalletCard = () => {
  const { user } = useApp();
  const balance = user?.wallet?.balance || 0;
  const validUntil = user?.wallet?.valid_until
    ? new Date(user.wallet.valid_until).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";
  const daysRemaining = user?.wallet?.days_until_expiry || 0;

  return (
    <div className="max-w-sm">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex justify-between mb-6">
          <div>
            <p className="text-xs tracking-[0.3em] text-slate-400 uppercase mb-2">
              Credits
            </p>

            <div className="flex items-end gap-3">
              <h2 className="text-5xl font-bold text-slate-900">{balance}</h2>
              <span className="text-slate-500 mb-1 text-sm">Pages</span>
            </div>
          </div>

          <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center">
            <Database className="text-blue-600" size={26} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar size={16} className="text-slate-400" />
            <span className="text-slate-400">Valid Until</span>
            <span className="font-medium">{validUntil}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 size={16} className="text-green-500" />
            <span className="text-slate-400">Status</span>
            <span className="font-medium">Active</span>
          </div>
        </div>

        {/* CTA */}
        <button className="group w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4 text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-[1px] active:translate-y-0">
          <div className="flex justify-between items-center">
            <div className="text-left">
              <p className="text-xs text-blue-100 tracking-widest uppercase">
                Credits Valid For
              </p>
              <p className="text-lg font-semibold">{daysRemaining} Days</p>
            </div>

            <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center transition group-hover:translate-x-1 group-hover:-translate-y-1">
              <ArrowUpRight size={18} />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default WalletCard;
