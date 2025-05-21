
// Simple toast implementation for the module
// Can be replaced with the app's toast system when integrating

export interface ToastOptions {
  title: string;
  description?: string;
}

interface UseToastReturn {
  toast: (options: ToastOptions) => void;
}

export function useToast(): UseToastReturn {
  const toast = (options: ToastOptions) => {
    console.log(`Toast: ${options.title}${options.description ? ` - ${options.description}` : ''}`);
    // In a real implementation, this would create a toast notification
  };

  return { toast };
}
