
// This file has been refactored into smaller components
import React from "react";
import Layout from "@/components/Layout";
import OnboardingProvider from "@/components/onboarding/OnboardingProvider";
import ProgressIndicator from "@/components/onboarding/ProgressIndicator";
import OnboardingSteps from "@/components/onboarding/steps/OnboardingSteps";

const Onboarding = () => {
  return (
    <OnboardingProvider>
      <Layout className="py-6">
        <div className="w-full max-w-2xl mx-auto px-4">
          <ProgressIndicator />
          <OnboardingSteps />
        </div>
      </Layout>
    </OnboardingProvider>
  );
};

export default Onboarding;
