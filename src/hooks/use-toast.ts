
// This implementation follows shadcn/ui toast pattern
import { 
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

import {
  useToast as useToastPrimitive,
} from "@radix-ui/react-toast";

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000;

type ToastState = {
  toasts: ToasterToast[];
};

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastState: ToastState = {
  toasts: [],
};

const listeners: Array<(state: ToastState) => void> = [];

function addToast(toast: Omit<ToasterToast, "id">) {
  const id = genId();
  
  const newToast = {
    ...toast,
    id,
  };
  
  toastState.toasts = [newToast, ...toastState.toasts].slice(0, TOAST_LIMIT);
  
  listeners.forEach((listener) => {
    listener(toastState);
  });

  return id;
}

function dismissToast(toastId: string) {
  toastState.toasts = toastState.toasts.map((t) =>
    t.id === toastId
      ? {
          ...t,
          open: false,
        }
      : t
  );
  
  listeners.forEach((listener) => {
    listener(toastState);
  });
}

export function useToast() {
  const [, forceUpdate] = React.useState({});

  React.useEffect(() => {
    listeners.push(forceUpdate);
    return () => {
      const index = listeners.indexOf(forceUpdate);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    toasts: toastState.toasts,
    toast: addToast,
    dismiss: dismissToast,
  };
}

export const toast = {
  success: (props: Omit<ToasterToast, "id" | "variant">) => {
    return addToast({ ...props, variant: "default" });
  },
  error: (props: Omit<ToasterToast, "id" | "variant">) => {
    return addToast({ ...props, variant: "destructive" });
  },
  info: (props: Omit<ToasterToast, "id" | "variant">) => {
    return addToast({ ...props, variant: "default" });
  },
  warning: (props: Omit<ToasterToast, "id" | "variant">) => {
    return addToast({ ...props, variant: "default" });
  },
};
