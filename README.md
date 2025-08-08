# Airtable Timeline Assignment — Documentation

**Project:** Interactive Timeline Visualization (Next.js + TypeScript)

---

## Overview

Interactive timeline built with **Next.js** and **TypeScript**, showing items in compact lanes. Features include zoom, priority filtering, playback, analytics, inline editing, drag/drop, and responsive design (desktop lanes + mobile table view).

---

## Technologies

* Next.js, TypeScript, Tailwind CSS
* ESLint, date-fns, clsx, lucide-react

---

## Structure

```
src/
├─ components/   # UI
├─ hooks/        # Custom logic
├─ utils/        # Helpers
├─ interfaces/   # Types
├─ app/        # Next.js pages
├─ data/
```

---

## Main Component — `page.tsx`

* **Hooks:**

  * `useTimelineData` — Data & filtering
  * `useTimelineLayout` — Lanes & positions
  * `useTimelinePlayback` — Animation
  * `useTimelineInteractions` — User actions
* **Controls:** Zoom slider, priority filter, playback button, analytics toggle
* **Views:**

  * Desktop: Lane-based timeline with tooltips & labels
  * Mobile: Editable task table
* **Extras:** Stats via `calculateStats`, hover tooltips, inline editing

---

## Run

```bash
git clone <repo>
npm install
npm run dev
```

Visit `http://localhost:3000`

---

## Design Choices

* Clear separation of logic/UI
* Strong typing with TypeScript
* Responsive layout
* Isolated lane calculation for easy testing

---

## Improvements

* Atomic design structure
* More tests (unit, integration, E2E)
* Accessibility and performance optimizations
* Dynamic label sizing

---

## Future Enhancements

* Export to image/PDF
* Sub-day time granularity
* Advanced animations
* Theming
* Live collaboration

---

## Conclusion

`page.tsx` coordinates hooks, controls, and views for a clean, interactive, and extensible timeline.
