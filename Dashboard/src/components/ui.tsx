import React from "react";
import { cn } from "@/lib/utils";

// Card Component
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border border-slate-200 bg-card text-card-foreground shadow-sm bg-white p-5", className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

// Section Heading Component
export function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

// Primary Button Component
export const PrimaryButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-blue-700 text-white hover:bg-blue-800 text-xs font-semibold px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        className
      )}
      {...props}
    />
  )
);
PrimaryButton.displayName = "PrimaryButton";

// Secondary Button Component
export const SecondaryButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        className
      )}
      {...props}
    />
  )
);
SecondaryButton.displayName = "SecondaryButton";

// Modal Dialog Component
interface ModalProps {
  title: string;
  onClose: () => void;
  footer?: React.ReactNode;
  wide?: boolean;
  children: React.ReactNode;
}

export function Modal({ title, onClose, footer, wide, children }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className={cn("bg-white rounded-lg shadow-xl flex flex-col max-h-[85vh] overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150", wide ? "w-[680px]" : "w-[480px]")}>
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-sm cursor-pointer" aria-label="Close">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>
        {footer && (
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-end gap-2 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Form Field Wrapper
interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function Field({ label, required, error, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1 w-full mb-3">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{hint}</p>}
      {error && <p className="text-[10px] text-red-500 font-semibold mt-0.5">{error}</p>}
    </div>
  );
}

// Styling classes functions
export function fieldInputCls(hasError?: boolean | string) {
  return cn(
    "w-full px-3 py-2 text-xs rounded-md border bg-white text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed",
    hasError ? "border-red-500 ring-1 ring-red-300 focus:ring-red-100 focus:border-red-500" : "border-slate-300"
  );
}

export const inputCls = "w-full px-3 py-2 text-xs rounded-md border border-slate-300 bg-white text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed";

// Badges & Pills
export function RoleBadge({ role }: { role?: string }) {
  if (!role) return null;
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-300">
      {role}
    </span>
  );
}

export function StatusPill({ status }: { status?: string }) {
  if (!status) return null;
  const isActive = status.toUpperCase() === "ACTIVE";
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border",
        isActive
          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
          : "bg-slate-100 text-slate-500 border-slate-300"
      )}
    >
      {status.toUpperCase()}
    </span>
  );
}

// Inline Code Display
export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-[11px] border border-slate-200">
      {children}
    </code>
  );
}

// Icon Action Button
export function IconAction({
  icon,
  label,
  danger,
  onClick,
}: {
  icon?: string;
  label?: string;
  danger?: boolean;
  onClick: () => void;
}) {
  const displayLabel = label ?? icon ?? "Action";
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-[10px] font-bold px-2 py-1 rounded transition-colors border hover:shadow-sm mr-1.5 cursor-pointer",
        danger
          ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
          : "bg-slate-50 text-blue-600 border-slate-200 hover:bg-slate-100"
      )}
    >
      {displayLabel}
    </button>
  );
}

// Table Loading & Empty state rows
export function LoadingRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-8 text-slate-400 text-xs font-medium">
        Loading...
      </td>
    </tr>
  );
}

export function EmptyRow({ colSpan, message }: { colSpan: number; message?: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-8 text-slate-400 text-xs font-medium">
        {message ?? "No records found."}
      </td>
    </tr>
  );
}
