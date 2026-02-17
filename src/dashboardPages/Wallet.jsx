import {
  Database,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function Wallet() {
  const plans = [
    {
      name: "Starter",
      price: "₹2,000",
      pages: "8 Translation Pages",
      rate: "UNIT RATE: ₹250.00 / PAGE",
    },
    {
      name: "Basic",
      price: "₹4,000",
      pages: "270 Translation Pages",
      rate: "UNIT RATE: ₹14.81 / PAGE",
    },
    {
      name: "Standard",
      price: "₹5,000",
      pages: "420 Translation Pages",
      rate: "UNIT RATE: ₹11.90 / PAGE",
    },
    {
      name: "Growth",
      price: "₹10,000",
      pages: "833 Translation Pages",
      rate: "UNIT RATE: ₹12.00 / PAGE",
    },
    {
      name: "Business",
      price: "₹25,000",
      pages: "2,272 Translation Pages",
      rate: "UNIT RATE: ₹11.00 / PAGE",
      recommended: true,
    },
    {
      name: "Enterprise",
      price: "₹50,000",
      pages: "5,000 Translation Pages",
      rate: "UNIT RATE: ₹10.00 / PAGE",
      recommended: true,
    },
  ];

  return (
    <div className="space-y-12">
        {/* Header */}
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-3">
          Translation Credits
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Texlate Wallet
        </h1>

        <p className="text-gray-500 max-w-xl text-sm sm:text-base">
          View your available translation pages and purchase additional credits
          to translate documents.
        </p>
      </div>
      {/* ---------------- WALLET CARD ---------------- */}
      <div className="max-w-sm">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between mb-6">
            <div>
              <p className="text-xs tracking-[0.3em] text-slate-400 uppercase mb-2">
                Credits
              </p>

              <div className="flex items-end gap-3">
                <h2 className="text-5xl font-bold text-slate-900">0</h2>
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
              <span className="font-medium">N/A</span>
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
                <p className="text-lg font-semibold">0 Days</p>
              </div>

              <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center transition group-hover:translate-x-1 group-hover:-translate-y-1">
                <ArrowUpRight size={18} />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* ---------------- BUY CREDITS ---------------- */}
      <div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <p className="text-xs tracking-[0.35em] text-slate-400 uppercase">
              Buy Translation Credits
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Buy Translation Credits
            </h2>
          </div>

          <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-4 py-2 rounded-full flex items-center gap-2">
            SECURE PAYMENT VIA RAZORPAY
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Plans */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={i}
              className="group relative rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1"
            >
              {/* recommended glow */}
              {plan.recommended && (
                <div className="absolute inset-0 rounded-2xl bg-blue-50 opacity-0 group-hover:opacity-100 transition" />
              )}

              <div className="relative">
                <div className="flex justify-between mb-6">
                  <p className="text-xs tracking-[0.3em] text-slate-400 uppercase">
                    {plan.name}
                  </p>

                  {plan.recommended && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-600">
                      <Sparkles size={12} />
                      RECOMMENDED
                    </span>
                  )}
                </div>

                <h3 className="text-4xl font-bold text-slate-900 mb-4">
                  {plan.price}
                </h3>

                <p className="font-medium text-slate-700 mb-1">{plan.pages}</p>
                <p className="text-xs tracking-wide text-slate-400 mb-8">
                  {plan.rate}
                </p>

                {/* Better Button */}
                <button className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 font-semibold text-slate-700 transition-all duration-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2">
                  Buy Credits
                  <ChevronRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
