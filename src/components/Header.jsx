import ProgressRing from "./ProgressRing.jsx";

export default function Header({ percent, theme, onToggleTheme, onExport, onImport, onAdd }) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
            <path
              d="M9 11.5 L12 14.5 L18.5 8"
              stroke="#fff"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="4" y="4" width="16" height="16" rx="4" stroke="rgba(255,255,255,.55)" strokeWidth="1.6" />
          </svg>
        </div>
        <div>
          <h1>Assignly</h1>
          <p>Track everything you need to hand in</p>
        </div>
      </div>

      <div className="header-actions">
        <div className="ring-wrap">
          <ProgressRing percent={percent} />
          <span className="ring-caption">
            overall
            <br />
            progress
          </span>
        </div>
        <button className="icon-btn ghost" onClick={onExport} title="Export JSON backup">
          ⬇ <span className="hide-sm">Export</span>
        </button>
        <button className="icon-btn ghost" onClick={onImport} title="Import JSON backup">
          ⬆ <span className="hide-sm">Import</span>
        </button>
        <button
          className="icon-btn ghost"
          onClick={onToggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
          <span className="hide-sm">{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
        <button className="btn primary" onClick={onAdd}>
          ＋ New assignment
        </button>
      </div>
    </header>
  );
}
