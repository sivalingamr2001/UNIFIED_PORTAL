import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface ConfirmOptions { title?: string; message: string; confirmLabel?: string; danger?: boolean }
interface ConfirmContextValue { confirm: (options: ConfirmOptions | string) => Promise<boolean> }

const ConfirmContext = createContext<ConfirmContextValue | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ options: ConfirmOptions; resolve: (v: boolean) => void } | null>(null);

  const confirm = useCallback((options: ConfirmOptions | string): Promise<boolean> => {
    const normalized: ConfirmOptions = typeof options === "string" ? { message: options } : options;
    return new Promise<boolean>((resolve) => setState({ options: normalized, resolve }));
  }, []);

  const handle = (result: boolean) => {
    state?.resolve(result);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-[2px] flex items-center justify-center z-[100]">
          <div className="bg-surface rounded-xl shadow-2xl w-[400px] p-6">
            <h3 className="font-display text-[16px] font-semibold text-ink mb-2">{state.options.title ?? "Please confirm"}</h3>
            <p className="text-sm text-muted leading-relaxed">{state.options.message}</p>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => handle(false)} className="px-4 py-2 text-sm font-medium rounded-lg border border-line text-muted hover:bg-surface2">Cancel</button>
              <button onClick={() => handle(true)} className={`px-4 py-2 text-sm font-semibold rounded-lg text-white ${state.options.danger ? "bg-rose-600 hover:bg-rose-700" : "bg-accent hover:bg-accent-dark"}`}>
                {state.options.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmContextValue {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within a ConfirmProvider");
  return ctx;
}
