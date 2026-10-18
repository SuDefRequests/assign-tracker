export default function EmptyState({ onAdd, onDemo }) {
  return (
    <div className="empty">
      <div className="empty-inner">
        <div className="empty-art" aria-hidden="true">
          📚
        </div>
        <h2>Nothing here yet</h2>
        <p>Add your first assignment and start tracking deadlines, priority and progress.</p>
        <div className="empty-actions">
          <button className="btn primary" onClick={onAdd}>
            ＋ Add assignment
          </button>
          <button className="btn ghost" onClick={onDemo}>
            🧪 Load sample data
          </button>
        </div>
      </div>
    </div>
  );
}
