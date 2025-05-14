
import { toast as sonnerToast } from "sonner";

// Define the toast interface
export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
};

// Create a simple toast function that wraps sonner
export const toast = (props: ToastProps) => {
  const { title, description, variant } = props;
  
  if (variant === "destructive") {
    return sonnerToast.error(title, {
      description,
    });
  }
  
  return sonnerToast(title || "", {
    description,
  });
};

// Export hook for compatibility
export const useToast = () => {
  return {
    toast,
    toasts: [] // Empty array to match the shape of the original hook
  };
};

// Export sonnerToast directly
export { sonnerToast };
