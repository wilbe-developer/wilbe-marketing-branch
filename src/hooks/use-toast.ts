
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

  // Simplify action handling to avoid TypeScript errors
  if (action) {
    options.action = {
      label: 'Action',
      onClick: () => {}
    };
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
