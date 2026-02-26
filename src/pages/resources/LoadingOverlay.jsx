import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function LoadingOverlay({ steps, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(
    Array(steps.length).fill(false),
  );

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCompletedSteps((prev) => {
          const updated = [...prev];
          updated[currentStep] = true;
          return updated;
        });
        setCurrentStep((prev) => prev + 1);
      }, 4000); // ⏱ 4 seconds per step

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete(); // notify parent when all steps are done
    }
  }, [currentStep, steps.length, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-md text-center"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Please wait...
        </h2>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((label, index) => (
            <div key={index} className="flex items-center gap-3">
              {/* Step Icon */}
              <div className="w-5 h-5 flex items-center justify-center">
                {completedSteps[index] ? (
                  <CheckCircle2 className="text-green-500 w-5 h-5" />
                ) : index === currentStep ? (
                  <Loader2 className="text-indigo-500 w-5 h-5 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                )}
              </div>

              {/* Step Label */}
              <span
                className={`text-sm ${
                  completedSteps[index]
                    ? "text-green-600"
                    : index === currentStep
                      ? "text-indigo-600 font-medium"
                      : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
