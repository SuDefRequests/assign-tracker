import { fmtDate, dueMeta, statusOf } from "../lib/date.js";

const priorityMeta = {
  high: { label: "High", cls: "high" },
  med: { label: "Medium", cls: "med" },
  low: { label: "Low", cls: "low" },
};

function barClass(a, status) {
  if (status === "done") return "bar-done";
  if (status === "overdue") return "bar-overdue";
  return "bar-active";
}

export default function AssignmentCard({ a, onEdit, onDelete, onToggleDone, onProgress }) {
  const status = statusOf(a);
  const meta = dueMeta(a.due);
  const prio = priorityMeta[a.priority] ?? priorityMeta.med;
  const isDone = status === "done";

  return (
    <article className={`card ${status}`} aria-label={a.title}>
      <div className="card-top">
        <div className="card-meta">
          {a.course && <span className="course-chip">{a.course}</span>}
          <span className={`prio-dot ${prio.cls}`} title={`${prio.label} priority`} />
        </div>
        <span className={`due-badge ${meta.tone}`} title={meta.long}>
          {isDone ? "Completed" : meta.tone === "overdue" ? `⚠ ${meta.short}` : `${meta.short}`}
        </span>
      </div>

      <h3 className={`card-title ${isDone ? "strikethrough" : ""}`} onClick={() => onEdit(a)}>
        {a.title}
      </h3>

      {!isDone && (
        <p className="card-due-line">
          <span>📅</span> {fmtDate(a.due)} · {meta.long}
          {a.estHours ? <span className="est">· ~{a.estHours}h est.</span> : null}
        </p>
      )}
      {isDone && a.completedAt && (
        <p className="card-due-line">
          ✅ Finished {fmtDate(a.due)} — nice work!
        </p>
      )}

      {a.notes && <p className="card-notes">{a.notes}</p>}

      {a.tags?.length > 0 && (
        <div className="tag-row">
          {a.tags.map((t) => (
            <span key={t} className="tag">
              #{t}
            </span>
          ))}
        </div>
      )}

      <div className="progress-row">
        <div className="progress-track">
          <div
            className={`progress-fill ${barClass(a, status)}`}
            style={{ width: `${a.progress}%` }}
          />
        </div>
        <span className="progress-num">{a.progress}%</span>
      </div>

      {!isDone && (
        <input
          className="progress-slider"
          type="range"
          min="0"
          max="100"
          step="5"
          value={a.progress}
          aria-label={`Progress for ${a.title}`}
          onChange={(e) => onProgress(a, Number(e.target.value))}
        />
      )}

      <div className="card-actions">
        <button
          className={`btn tiny ${isDone ? "ghost" : "success"}`}
          onClick={() => onToggleDone(a)}
          title={isDone ? "Mark as not done" : "Mark as complete"}
        >
          {isDone ? "↩ Undo" : "✓ Done"}
        </button>
        <span className="flex-spacer" />
        <button className="icon-btn ghost" onClick={() => onEdit(a)} title="Edit">
          ✏️ <span className="hide-sm">Edit</span>
        </button>
        <button
          className="icon-btn ghost danger-hover"
          onClick={() => onDelete(a)}
          title="Delete"
        >
          🗑 <span className="hide-sm">Delete</span>
        </button>
      </div>
    </article>
  );
}
