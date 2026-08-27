import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";
interface ToastItem { id: number; message: string; type: ToastType }
interface ToastContextValue { showToast: (message?: string, type?: ToastType) => void }

const ToastContext = createContext<ToastContextValue | undefined>(undefined);
const TYPE_STYLES: Record<ToastType, string> = {
  success: "bg-emerald-500/10 text-emerald-700 border-emerald-500/25",
  error: "bg-rose-500/10 text-rose-700 border-rose-500/25",
  info: "bg-sky-500/10 text-sky-700 border-sky-500/25",
  warning: "bg-amber-500/10 text-amber-700 border-amber-500/25",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const showToast = useCallback((message?: string, type: ToastType = "info") => {
    if (!message) return;
    const id = nextId.current++;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);

  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80" aria-live="polite" role="status">
        {toasts.map((t) => (
          <div key={t.id} className={`border rounded-lg px-4 py-3 text-sm shadow-lg flex items-start justify-between gap-3 ${TYPE_STYLES[t.type]}`}>
            <span className="leading-snug">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="opacity-60 hover:opacity-100 leading-none" aria-label="Dismiss">✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
