// ---------- date helpers (timezone-safe, local midnight based) ----------

export function toMidnight(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayMidnight() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

export function daysUntil(dateStr) {
  return Math.round((toMidnight(dateStr) - todayMidnight()) / 86400000);
}

/** ISO date (YYYY-MM-DD) offset by n days from today */
export function isoOffset(n) {
  const d = todayMidnight();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function fmtDate(dateStr) {
  return toMidnight(dateStr).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function dueMeta(dateStr) {
  const d = daysUntil(dateStr);
  if (d < 0)
    return {
      tone: "overdue",
      short: d === -1 ? "1d late" : `${-d}d late`,
      long: d === -1 ? "Overdue — was due yesterday" : `Overdue by ${-d} days`,
    };
  if (d === 0) return { tone: "today", short: "Today", long: "Due today" };
  if (d === 1)
    return { tone: "soon", short: "1d", long: "Due tomorrow" };
  if (d <= 3) return { tone: "soon", short: `${d}d`, long: `Due in ${d} days` };
  return { tone: "calm", short: `${d}d`, long: `Due in ${d} days` };
}

// ---------- assignment model ----------

export function statusOf(a) {
  if (a.progress >= 100) return "done";
  if (daysUntil(a.due) < 0) return "overdue";
  if (daysUntil(a.due) <= 3) return "soon";
  return "active";
}

export function newId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const PRIORITIES = [
  { value: "high", label: "High", dot: "🔴" },
  { value: "med", label: "Medium", dot: "🟡" },
  { value: "low", label: "Low", dot: "🟢" },
];

export function blankAssignment() {
  return {
    title: "",
    course: "",
    priority: "med",
    due: isoOffset(7),
    estHours: "",
    progress: 0,
    tags: "",
    notes: "",
  };
}

export function sampleAssignments() {
  return [
    {
      id: newId(),
      title: "Database ER-model report",
      course: "CS201 Databases",
      priority: "high",
      due: isoOffset(2),
      estHours: 6,
      progress: 45,
      tags: ["report", "erd"],
      notes: "Include the normalisation section. Meet with team Thursday.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      prevProgress: 30,
    },
    {
      id: newId(),
      title: "Linear algebra problem set 4",
      course: "MATH210",
      priority: "med",
      due: isoOffset(5),
      estHours: 4,
      progress: 10,
      tags: ["homework"],
      notes: "Eigenvalues chapter, exercises 1–18.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: newId(),
      title: "History reading response",
      course: "HIST105",
      priority: "low",
      due: isoOffset(-2),
      estHours: 2,
      progress: 0,
      tags: ["essay"],
      notes: "500 words on the assigned chapters.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: newId(),
      title: "Physics lab write-up",
      course: "PHY150",
      priority: "med",
      due: isoOffset(-1),
      estHours: 3,
      progress: 70,
      tags: ["lab"],
      notes: "Graphs still missing.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: newId(),
      title: "Intro to ethics essay",
      course: "PHIL101",
      priority: "med",
      due: isoOffset(-6),
      estHours: 5,
      progress: 100,
      tags: ["essay"],
      notes: "Submitted via portal.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ];
}
