
import React from "react";
import { toast as sonnerToast } from "sonner";
import { type ToastActionElement } from "@/components/ui/toast";

type ToastProps = {
  id?: string;
  title?: string;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
  duration?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

// Helper function to wrap sonner toast with our custom options
export const toast = ({
  title,
  description,
  action,
  variant = "default",
  duration = 5000,
  ...rest
}: ToastProps) => {
  const options: any = {
    ...rest,
    duration,
    className: variant === "destructive" ? "destructive" : ""
  };

  // Properly handle the action prop for Sonner
  if (action) {
    // Safely extract properties from action if it's a valid React element
    if (React.isValidElement(action) && action.props) {
      options.action = {
        label: action.props.children || 'Action',
        onClick: action.props.onClick || (() => {})
      };
    } else {
      // Fallback for non-element actions
      options.action = {
        label: 'Action',
        onClick: () => {}
      };
    }
  }

  return sonnerToast(title || "", {
    description,
    ...options
  });
};

// Add backward compatibility with shadcn/ui Toaster
export const useToast = () => {
  // Return dummy toasts array for backward compatibility
  const dummyToasts: ToastProps[] = [];
  
  return {
    toast,
    toasts: dummyToasts // This makes the shadcn/ui Toaster component happy
  };
};
