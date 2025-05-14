
import { useToast as useShadcnToast } from "@/components/ui/use-toast";
import { toast as shadcnToast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";

export const useToast = useShadcnToast;
export const toast = shadcnToast;
export { sonnerToast };
