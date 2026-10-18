import { useEffect, useRef, useState } from "react";
import { PRIORITIES, blankAssignment } from "../lib/date.js";

export default function AssignmentModal({ editing, onClose, onSave, onDelete }) {
  // editing = null → new assignment; editing = assignment → edit mode
  const [form, setForm] = useState(
    editing
      ? {
          title: editing.title,
          course: editing.course || "",
          priority: editing.priority,
          due: editing.due,
          estHours: editing.estHours ?? "",
          progress: editing.progress,
          tags: (editing.tags || []).join(", "),
          notes: editing.notes || "",
        }
      : blankAssignment()
  );
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (field) => (e) => {
    const value = e.target.type === "range" ? Number(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.due) return;
    const tags = form.tags
      .split(",")
      .map((t) => t.trim().replace(/^#/, "").toLowerCase())
      .filter(Boolean);
    onSave(
      {
        ...form,
        title: form.title.trim(),
        tags,
        estHours: form.estHours === "" ? null : Number(form.estHours),
      },
      editing?.id ?? null
    );
  };

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-head">
          <h2>{editing ? "✏️ Edit assignment" : "✨ New assignment"}</h2>
          <button className="close-x" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={submit} autoComplete="off">
          <div className="form-grid">
            <label className="span2">
              Title <em>*</em>
              <input
                ref={titleRef}
                required
                maxLength={80}
                placeholder="e.g. Database ER-model report"
                value={form.title}
                onChange={set("title")}
              />
            </label>
            <label>
              Course / subject
              <input
                maxLength={40}
                placeholder="e.g. CS201 Databases"
                value={form.course}
                onChange={set("course")}
              />
            </label>
            <label>
              Priority
              <select value={form.priority} onChange={set("priority")}>
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.dot} {p.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Deadline <em>*</em>
              <input
                type="date"
                required
                value={form.due}
                onChange={set("due")}
              />
            </label>
            <label>
              Estimated hours
              <input
                type="number"
                min="0"
                max="200"
                step="0.5"
                placeholder="e.g. 6"
                value={form.estHours}
                onChange={set("estHours")}
              />
            </label>
            <label className="span2 slider-label">
              <span>
                Progress <output>{form.progress}%</output>
              </span>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={form.progress}
                onChange={set("progress")}
              />
            </label>
            <label className="span2">
              Tags <small>(comma-separated)</small>
              <input
                placeholder="report, erd, urgent"
                value={form.tags}
                onChange={set("tags")}
              />
            </label>
            <label className="span2">
              Notes
              <textarea
                rows={3}
                maxLength={500}
                placeholder="Requirements, links, meeting times…"
                value={form.notes}
                onChange={set("notes")}
              />
            </label>
          </div>

          <div className="modal-foot">
            {editing ? (
              <button type="button" className="btn danger ghost" onClick={() => onDelete(editing)}>
                🗑 Delete
              </button>
            ) : (
              <span className="flex-spacer" />
            )}
            <span className="flex-spacer" />
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              {editing ? "Save changes" : "Add assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
