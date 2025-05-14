
import { toast as sonnerToast } from "sonner";

type ToastOptions = {
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactElement;
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
}: ToastOptions) => {
  const options = {
    ...rest,
    duration,
    className: variant === "destructive" ? "destructive" : ""
  };

  if (action) {
    options.action = action;
  }

  return sonnerToast(title, {
    description,
    ...options
  });
};

export const useToast = () => {
  return {
    toast
  };
};
