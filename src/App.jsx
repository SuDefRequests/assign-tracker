import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage.js";
import Header from "./components/Header.jsx";
import StatsRow from "./components/StatsRow.jsx";
import Toolbar from "./components/Toolbar.jsx";
import AssignmentCard from "./components/AssignmentCard.jsx";
import AssignmentModal from "./components/AssignmentModal.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";
import Toasts from "./components/Toasts.jsx";
import EmptyState from "./components/EmptyState.jsx";
import { statusOf, daysUntil, newId, sampleAssignments } from "./lib/date.js";

let toastSeq = 0;

export default function App() {
  const [assignments, setAssignments] = useLocalStorage("assignly.assignments.v1", []);
  const [theme, setTheme] = useLocalStorage("assignly.theme", "dark");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("due");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [toasts, setToasts] = useState([]);
  const importRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // ---------------- toasts ----------------
  const toast = useCallback((message, type = "ok", icon) => {
    const icons = { ok: "✅", info: "ℹ️", danger: "🗑", danger2: "⚠️" };
    setToasts((t) => [
      ...t.slice(-3),
      { id: ++toastSeq, message, type, icon: icon ?? icons[type] },
    ]);
  }, []);
  const closeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  // ---------------- CRUD ----------------
  const openAdd = useCallback(() => {
    setEditing(null);
    setModalOpen(true);
  }, []);
  const openEdit = useCallback((a) => {
    setEditing(a);
    setModalOpen(true);
  }, []);

  const saveAssignment = useCallback(
    (data, editId) => {
      setModalOpen(false);
      if (editId) {
        setAssignments((list) =>
          list.map((a) =>
            a.id === editId
              ? { ...a, ...data, updatedAt: new Date().toISOString() }
              : a
          )
        );
        toast("Assignment updated");
      } else {
        const now = new Date().toISOString();
        setAssignments((list) => [
          { ...data, id: newId(), createdAt: now, updatedAt: now },
          ...list,
        ]);
        toast(`"${data.title}" added`);
      }
    },
    [setAssignments, toast]
  );

  const removeAssignment = useCallback(
    (id) => {
      const removed = assignments.find((a) => a.id === id);
      setAssignments((list) => list.filter((a) => a.id !== id));
      setPendingDelete(null);
      setModalOpen(false);
      if (removed) toast(`"${removed.title}" deleted`, "danger");
    },
    [assignments, setAssignments, toast]
  );

  const patchProgress = useCallback(
    (a, value) => {
      setAssignments((list) =>
        list.map((x) =>
          x.id === a.id
            ? { ...x, progress: value, updatedAt: new Date().toISOString() }
            : x
        )
      );
      if (value === 100) toast(`"${a.title}" completed! 🎉`, "ok", "🎉");
    },
    [setAssignments, toast]
  );

  const toggleDone = useCallback(
    (a) => {
      const now = new Date().toISOString();
      setAssignments((list) =>
        list.map((x) => {
          if (x.id !== a.id) return x;
          if (x.progress >= 100) {
            return {
              ...x,
              progress: x.prevProgress ?? 60,
              completedAt: undefined,
              updatedAt: now,
            };
          }
          return {
            ...x,
            prevProgress: x.progress,
            progress: 100,
            completedAt: now,
            updatedAt: now,
          };
        })
      );
      if (a.progress < 100) toast(`"${a.title}" completed! 🎉`, "ok", "🎉");
      else toast(`"${a.title}" reopened`, "info", "↩");
    },
    [setAssignments, toast]
  );

  // ---------------- import / export ----------------
  const exportJson = useCallback(() => {
    if (!assignments.length) {
      toast("Nothing to export yet", "info");
      return;
    }
    const blob = new Blob([JSON.stringify(assignments, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `assignly-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Backup exported", "info", "⬇");
  }, [assignments, toast]);

  const importJson = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (!Array.isArray(data)) throw new Error("not an array");
          const valid = data.filter(
            (x) => typeof x?.title === "string" && typeof x?.due === "string"
          );
          if (!valid.length) throw new Error("no valid rows");
          setAssignments((list) => {
            const have = new Set(list.map((a) => a.id));
            const merged = [...list];
            for (const item of valid) {
              if (!have.has(item.id)) merged.push(item);
            }
            return merged;
          });
          toast(`Imported ${valid.length} assignment${valid.length > 1 ? "s" : ""}`, "info", "⬆");
        } catch {
          toast("Couldn't read that file — expected an Assignly JSON backup", "danger", "⚠️");
        }
      };
      reader.readAsText(file);
    },
    [setAssignments, toast]
  );

  // ---------------- derived data ----------------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = assignments.filter((a) => {
      if (q) {
        const hay = `${a.title} ${a.course} ${a.notes} ${(a.tags || []).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filter === "done") return statusOf(a) === "done";
      if (filter === "overdue") return statusOf(a) === "overdue";
      if (filter === "soon") return statusOf(a) === "soon";
      if (filter === "active") {
        const s = statusOf(a);
        return s === "active" || s === "soon";
      }
      return true;
    });

    const prioRank = { high: 0, med: 1, low: 2 };
    list = [...list].sort((x, y) => {
      switch (sort) {
        case "priority":
          return (
            prioRank[x.priority] - prioRank[y.priority] ||
            daysUntil(x.due) - daysUntil(y.due)
          );
        case "progress":
          return x.progress - y.progress || daysUntil(x.due) - daysUntil(y.due);
        case "updated":
          return new Date(y.updatedAt || 0) - new Date(x.updatedAt || 0);
        default:
          return daysUntil(x.due) - daysUntil(y.due);
      }
    });

    // done items sink to the bottom regardless of sort
    return [...list.filter((a) => statusOf(a) !== "done"), ...list.filter((a) => statusOf(a) === "done")];
  }, [assignments, query, filter, sort]);

  const counts = useMemo(() => {
    const c = { all: assignments.length, active: 0, soon: 0, overdue: 0, done: 0 };
    for (const a of assignments) {
      c[statusOf(a)] ??= 0;
      c[statusOf(a)] += 1;
    }
    return c;
  }, [assignments]);

  const stats = useMemo(() => {
    const done = counts.done;
    return {
      total: assignments.length,
      active: counts.active + counts.soon - 0,
      overdue: counts.overdue,
      done,
    };
  }, [counts]);

  const overallPercent = useMemo(() => {
    if (!assignments.length) return 0;
    const sum = assignments.reduce((acc, a) => acc + a.progress, 0);
    return Math.round(sum / assignments.length);
  }, [assignments]);

  // ---------------- keyboard shortcuts ----------------
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !modalOpen && !pendingDelete) setQuery("");
      if (modalOpen || pendingDelete) return;
      if (e.target.matches("input, textarea, select")) return;
      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        openAdd();
      }
      if (e.key === "/") {
        e.preventDefault();
        window.__assignlySearch?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, pendingDelete, openAdd]);

  const pendingDeleteFromModal = modalOpen && pendingDelete;

  return (
    <div className="shell">
      <Header
        percent={overallPercent}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        onExport={exportJson}
        onImport={() => importRef.current?.click()}
        onAdd={openAdd}
      />
      <input
        ref={importRef}
        type="file"
        accept="application/json"
        hidden
        onChange={importJson}
      />

      <main className="content">
        <StatsRow stats={stats} />

        <Toolbar
          query={query}
          onQuery={setQuery}
          filter={filter}
          onFilter={setFilter}
          counts={counts}
          sort={sort}
          onSort={setSort}
        />

        {filtered.length === 0 ? (
          assignments.length === 0 ? (
            <EmptyState onAdd={openAdd} onDemo={() => setAssignments(sampleAssignments())} />
          ) : (
            <div className="no-match">
              <p>No assignments match this filter. 🤷</p>
              <button
                className="btn ghost"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
              >
                Clear filters
              </button>
            </div>
          )
        ) : (
          <section className="grid">
            {filtered.map((a) => (
              <AssignmentCard
                key={a.id}
                a={a}
                onEdit={openEdit}
                onDelete={(x) => {
                  if (modalOpen) setModalOpen(false);
                  setPendingDelete(x);
                }}
                onToggleDone={toggleDone}
                onProgress={patchProgress}
              />
            ))}
          </section>
        )}

        <footer className="app-foot">
          <span>
            Shortcuts: <kbd>N</kbd> new · <kbd>/</kbd> search · <kbd>Esc</kbd> close
          </span>
          <span>Your data is saved locally in this browser.</span>
        </footer>
      </main>

      {modalOpen && (
        <AssignmentModal
          editing={editing}
          onClose={() => setModalOpen(false)}
          onSave={saveAssignment}
          onDelete={(a) => {
            if (a) setPendingDelete(a);
          }}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={pendingDeleteFromModal ? null : `Delete "${pendingDelete.title}"?`}
          message={`"${pendingDelete.title}" will be permanently removed. This can't be undone.`}
          confirmLabel="Yes, delete"
          onClose={() => setPendingDelete(null)}
          onConfirm={() => removeAssignment(pendingDelete.id)}
        />
      )}

      <Toasts toasts={toasts} onClose={closeToast} />
    </div>
  );
}
