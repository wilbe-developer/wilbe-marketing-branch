
import { toast as sonnerToast } from "sonner";
import { type ToastActionElement } from "@/components/ui/toast";

type ToastProps = {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

// For ShadcnUI Toast compatibility
export type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
};

export function toast({ title, description, action, variant = "default" }: ToastProps) {
  const options: Record<string, any> = {
    description,
    className: variant === "destructive" ? "destructive" : ""
  };

  // Simple action handling to avoid type issues
  if (action) {
    options.action = {
      label: 'Action',
      onClick: () => {}
    };
  }

  return sonnerToast(title || "", options);
}

export function useToast() {
  // Return an empty toasts array for Shadcn UI Toaster compatibility
  // but still use Sonner for actual toast functionality
  return { 
    toast,
    // Dummy empty array for Shadcn UI Toaster component
    toasts: [] as Toast[]
  };
}
