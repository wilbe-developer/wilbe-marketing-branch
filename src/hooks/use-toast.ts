
import { toast as sonnerToast } from "sonner";
import { type ToastActionElement } from "@/components/ui/toast";

type ToastProps = {
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
  return { toast };
}
