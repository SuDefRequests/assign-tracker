export default function StatsRow({ stats }) {
  const cards = [
    { key: "total", icon: "📚", label: "Assignments", value: stats.total, cls: "" },
    { key: "active", icon: "🚀", label: "In progress", value: stats.active, cls: "accent" },
    { key: "overdue", icon: "🔥", label: "Overdue", value: stats.overdue, cls: "danger" },
    { key: "done", icon: "✅", label: "Completed", value: stats.done, cls: "ok" },
  ];

  return (
    <section className="stats-row" aria-label="Statistics">
      {cards.map((c) => (
        <div key={c.key} className={`stat-card ${c.cls}`}>
          <span className="stat-icon">{c.icon}</span>
          <div>
            <strong>{c.value}</strong>
            <span>{c.label}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
