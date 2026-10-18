export default function Toolbar({
  query,
  onQuery,
  filter,
  onFilter,
  counts,
  sort,
  onSort,
  onAdd,
}) {
  const pills = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "soon", label: "Due soon" },
    { key: "overdue", label: "Overdue" },
    { key: "done", label: "Done" },
  ];

  return (
    <section className="toolbar">
      <div className="search-box">
        <span className="search-icon" aria-hidden="true">
          🔍
        </span>
        <input
          ref={(el) => el && (window.__assignlySearch = el)}
          type="search"
          placeholder="Search assignments, courses, tags…"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
      </div>

      <div className="pills" role="tablist" aria-label="Filter by status">
        {pills.map((p) => (
          <button
            key={p.key}
            role="tab"
            aria-selected={filter === p.key}
            className={`pill ${filter === p.key ? "active" : ""}`}
            onClick={() => onFilter(p.key)}
          >
            {p.label}
            <em>{counts[p.key]}</em>
          </button>
        ))}
      </div>

      <div className="toolbar-right">
        <label className="sort-wrap">
          <span>Sort</span>
          <select value={sort} onChange={(e) => onSort(e.target.value)}>
            <option value="due">Due date</option>
            <option value="priority">Priority</option>
            <option value="progress">Progress</option>
            <option value="updated">Recently updated</option>
          </select>
        </label>
      </div>
    </section>
  );
}
