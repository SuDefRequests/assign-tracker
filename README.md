# Assignly — Assignment Tracker

A beautiful, fast React app for tracking your assignments: deadlines, priority,
progress, notes, tags — all saved locally in your browser (no account needed).

## Run it

```bash
npm install    # first time only
npm run dev    # → http://localhost:5173
```

Production build: `npm run build` then `npm run preview`.

## Features

- **Add / edit / delete** assignments (delete has a confirmation dialog)
- **Deadlines** with smart badges — "Due today", "Tomorrow", "3d", "Overdue by 2 days"
- **Progress tracking** — drag the slider on any card, or use the 0–100 slider in the editor
- **Overall completion ring** in the header
- **Dashboard stats** — total, in progress, overdue, completed
- **Filter pills** (All / Active / Due soon / Overdue / Done) with live counts
- **Search** across titles, courses, notes, tags
- **Sort** by due date, priority, progress, or recently updated
- **Done toggle** — marks complete (progress snaps to 100); undo restores previous progress
- **Dark / light theme** toggle, remembered between visits
- **Export / import** JSON backups of your data
- **Keyboard shortcuts** — `N` new assignment, `/` focus search, `Esc` close
- **Sample data loader** in the empty state

## Tech

- React 18 + Vite, no other runtime dependencies
- All state persisted in `localStorage` (`assignly.assignments.v1`)
- Hand-written CSS (glassmorphism cards, aurora background, animations) in `src/styles.css`

## Structure

```
src/
├── App.jsx                  # all state + CRUD logic
├── styles.css               # the whole design system
├── lib/date.js              # date helpers, status derivation, samples
├── hooks/useLocalStorage.js # persistence hook
└── components/
    ├── Header.jsx           # brand, progress ring, export/import, theme, add
    ├── StatsRow.jsx         # 📚 🚀 🔥 ✅ stat cards
    ├── Toolbar.jsx          # search + filter pills + sort
    ├── AssignmentCard.jsx   # one assignment (progress slider, done, edit, delete)
    ├── AssignmentModal.jsx  # add/edit form
    ├── ConfirmDialog.jsx    # delete confirmation
    ├── ProgressRing.jsx     # SVG completion ring
    ├── EmptyState.jsx       # empty catalog
    └── Toasts.jsx           # toast notifications
```
# assign-tracker
