"use client";

import { useState, useEffect } from "react";
import LeadCaptureModal, { useLeadCapture } from "./LeadCaptureModal";

interface LeadCaptureWrapperProps {
  delay?: number;
  source?: string;
}

export default function LeadCaptureWrapper({
  delay = 5000,
  source = "landing_page",
}: LeadCaptureWrapperProps) {
  const { hasSubmitted, setHasSubmitted } = useLeadCapture();
  const [showLeadModal, setShowLeadModal] = useState(false);

  useEffect(() => {
    if (!hasSubmitted) {
      const timer = setTimeout(() => {
        setShowLeadModal(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [hasSubmitted, delay]);

  return (
    <LeadCaptureModal
      isOpen={showLeadModal}
      onClose={() => setShowLeadModal(false)}
      onSubmit={() => {
        setHasSubmitted(true);
        setShowLeadModal(false);
      }}
      source={source}
    />
  );
}
