"use client";

import * as React from "react";

export function ConfirmButton({
  children,
  confirmText,
  onConfirm,
  className,
}: {
  children: React.ReactNode;
  confirmText: string;
  onConfirm: () => void | Promise<void>;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        const ok = window.confirm(confirmText);
        if (!ok) return;
        await onConfirm();
      }}
    >
      {children}
    </button>
  );
}

