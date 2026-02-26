import React, { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ChevronRight, Sparkles, Zap } from "lucide-react";
import toast from "react-hot-toast";
import walletService from "../../services/WalletService";
import { useApp } from "../../context/AppContext";

const PackageCard = ({ packages, id, price, pages }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const { setBalance } = useApp();

  const [isProcessing, setIsProcessing] = useState(false);

  // Tier Naming Map
  const TIER_NAMES = [
    "Starter",
    "Basic",
    "Standard",
    "Growth",
    "Business",
    "Enterprise",
  ];
  const subTierName = TIER_NAMES[id - 1] || `Tier ${id}`; // Fallback if ID is out of bounds

  // Safety Calculations to prevent "undefined" errors
  const formattedPrice = (price ?? 0).toLocaleString();
  const formattedPages = (pages ?? 0).toLocaleString();
  const pricePerPage = price && pages ? (price / pages).toFixed(2) : "0.00";

  const handleSelectPackage = async (id) => {
    const selected = packages.find((p) => p.id === id);
    if (!selected || isProcessing) return;

    setIsProcessing(true);

    try {
      const loadingToast = toast.loading("Initializing payment...");

      // 1. Initiate Top-up
      const initResponse = await walletService.initiateTopUp(id);

      // 2. Load Razorpay Script if needed
      await walletService.loadRazorpayScript();

      // 3. Open Razorpay
      const options = {
        key: initResponse.key,
        amount: initResponse.amount,
        currency: initResponse.currency,
        order_id: initResponse.razorpay_order_id,
        name: "Texlate",
        description: `${selected.pages} Translation Pages`,
        handler: async function (razorpayResponse) {
          try {
            toast.loading("Verifying payment...", { id: loadingToast });

            // 4. Verify Payment
            const verifyResponse = await walletService.verifyTopUp({
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            });

            if (verifyResponse.success) {
              // 5. Update Balance
              setBalance(verifyResponse.new_balance);

              toast.custom(
                (t) => (
                  <div
                    className={`${t.visible ? "animate-in fade-in zoom-in" : "animate-out fade-out zoom-out"} 
                  max-w-md w-full bg-black shadow-2xl rounded-[1.5rem] pointer-events-auto flex border border-white/10`}
                  >
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Zap size={18} className="text-green-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                            Payment Successful
                          </p>
                          <p className="text-sm font-bold text-white mt-0.5">
                            {verifyResponse.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
                { duration: 4000, id: loadingToast },
              );
            } else {
              toast.error("Payment verification failed", { id: loadingToast });
            }
          } catch (verifyError) {
            console.error(verifyError);
            toast.error("Payment verification failed", { id: loadingToast });
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            toast.dismiss(loadingToast);
            setIsProcessing(false);
          },
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };
  return (
    <div className="group relative rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1">
      {/* recommended glow */}
      {id >= 5 && (
        <div className="absolute inset-0 rounded-2xl bg-blue-50 opacity-0 group-hover:opacity-100 transition" />
      )}

      <div className="relative">
        <div className="flex justify-between mb-6">
          <p className="text-xs tracking-[0.3em] text-slate-400 uppercase">
            {subTierName}
          </p>

          {id >= 5 && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-600">
              <Sparkles size={12} />
              RECOMMENDED
            </span>
          )}
        </div>

        <h3 className="text-4xl font-bold text-slate-900 mb-4">
          ₹{formattedPrice}
        </h3>

        <p className="font-medium text-slate-700 mb-1">
          {formattedPages} Translation Pages
        </p>
        <p className="text-xs tracking-wide text-slate-400 mb-8">
          Unit Rate: ₹{pricePerPage} / page
        </p>

        {/* Better Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSelectPackage(id);
          }}
          disabled={isProcessing}
          className="w-full rounded-xl border disabled:opacity-50 border-slate-200 bg-slate-50 py-3 font-semibold text-slate-700 transition-all duration-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
        >
          Buy Credits
          <ChevronRight
            size={16}
            className="transition group-hover:translate-x-1"
          />
        </button>
      </div>
    </div>
  );
};

export default PackageCard;
