import React from "react";
import OnboardingModal from "./resources/OnboardingModal";

const OnboardingPage = () => {
  return (
    <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center">
      {/* Always show the modal, cannot be closed */}
      <OnboardingModal canClose={false} />
    </div>
  );
};

export default OnboardingPage;
