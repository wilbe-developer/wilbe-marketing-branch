
import { toast as sonnerToast, type Toast as SonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

export function toast({ title, description, action, variant = "default" }: ToastProps) {
  const options: Record<string, any> = {
    description,
    className: variant === "destructive" ? "destructive" : ""
  };

  if (action) {
    options.action = action;
  }

  return sonnerToast(title || "", options);
}

// We're fully committing to Sonner, but providing compatibility with any components
// that might expect the old Shadcn interface
export function useToast() {
  return { 
    toast,
    // Empty array for compatibility with old components
    toasts: []
  };
}

// Re-export Sonner toast for direct usage
export { sonnerToast };
