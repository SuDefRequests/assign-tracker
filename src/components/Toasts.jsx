import { useEffect, useRef } from "react";

export default function Toasts({ toasts, onClose }) {
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onClose={onClose} />
      ))}
    </div>
  );
}

function Toast({ toast, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 2800);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  return (
    <div ref={ref} className={`toast toast-${toast.type}`}>
      <span className="toast-icon">{toast.icon}</span>
      <span>{toast.message}</span>
      <button className="toast-x" onClick={() => onClose(toast.id)}>
        ×
      </button>
    </div>
  );
}
