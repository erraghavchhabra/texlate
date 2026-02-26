import { ChevronRight } from "lucide-react";
import WalletCard from "./wallet/WalletCard";
import PackageCard from "./wallet/PackageCard";

export default function Wallet() {
  const packages = [
    { id: 1, price: 2000, pages: 8 },
    { id: 2, price: 4000, pages: 270 },
    { id: 3, price: 5000, pages: 420 },
    { id: 4, price: 10000, pages: 833 },
    { id: 5, price: 25000, pages: 2272 },
    { id: 6, price: 50000, pages: 5000 },
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
      <WalletCard />

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div key={pkg.id} className="package-grid-item">
              <PackageCard
                packages={packages}
                id={pkg.id}
                price={pkg.price}
                pages={pkg.pages}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
