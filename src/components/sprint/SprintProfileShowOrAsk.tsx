
import React from "react";
import { SprintProfileQuickEdit } from "./SprintProfileQuickEdit";
import { useSprintProfileQuickEdit } from "@/hooks/useSprintProfileQuickEdit";

interface SprintProfileShowOrAskProps {
  profileKey: string;
  label?: string;
  options?: { value: string; label: string }[];
  type?: "string" | "boolean" | "select" | "multi-select";
  children: React.ReactNode;
  displayStyle?: "standard" | "you-chose";
}

// Helper to wrap a field with quick-edit if value is present
export const SprintProfileShowOrAsk = ({
  profileKey,
  label,
  options,
  type = "boolean",
  children,
  displayStyle = "standard",
}: SprintProfileShowOrAskProps) => {
  const { sprintProfile } = useSprintProfileQuickEdit();
  
  // Check if profile has this value set
  const hasProfileValue = sprintProfile && 
    profileKey in sprintProfile && 
    sprintProfile[profileKey] !== null && 
    sprintProfile[profileKey] !== undefined;
  
  if (hasProfileValue) {
    // When profile value exists, just render children with the Change button available
    // The form renderers will handle displaying the actual value
    return (
      <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-medium">{label || profileKey}:</span>
          <SprintProfileQuickEdit
            profileKey={profileKey}
            label={label}
            type={type}
            options={options}
            description="You may change your answer here if needed."
          />
        </div>
        {children}
      </div>
    );
  }
  
  return <>{children}</>;
};
