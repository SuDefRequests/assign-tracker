import { useEffect, useState } from "react";

/** Persist state in localStorage under `key`, falling back to `initial`. */
export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or unavailable — keep working in-memory */
    }
  }, [key, value]);

  return [value, setValue];
}
