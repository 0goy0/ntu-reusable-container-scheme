# CC0006 Website Project: NTU Reusable Container Scheme

Interactive, scroll-driven website for our CC0006 group proposal, **a deposit-based reusable container sharing system across NTU canteens**. The source is `CC0006 Abstract & Proposal.pdf`, the single source of truth for content. Don't invent statistics that aren't in it.

## ⚠️ Standing rule: AI-use declaration
This is a graded school project. **After every user prompt, append it verbatim (typos included) to `AI-DECLARATION.md`** under the current session, together with any clarifying questions/answers and a one-line summary of what the AI produced. Never edit or paraphrase earlier entries. Start a new "Session" heading when the date changes.

## Decisions (as of 2026-09-23)
- **Purpose:** both a scroll story that presents the proposal *and* an interactive product demo.
- **Stack:** React 19 + Vite 8, hosted locally. Node v24 is installed.
- **Design:** Template A "Fresh Paper" look (warm paper, Fraunces serif + Inter, green palette), with Template B's borrow/return demo moved onto an **iPad-sized tablet** mock-up running the OmniBus app.
- **Map:** a stylised campus map in the style of MazeMap, presented as an NTU OmniBus integration. It is illustrative, not geographically exact. It shows 16 canteens/food courts, 24 halls, landmarks, live capacity, search, floors, directions and "nearest with space".
- **Deposit:** $5.
- **Name:** neutral title "NTU Reusable Container Scheme" (`TITLE` / `SHORT_TITLE` in `content.js`). "ReBox" was dropped.
- **Tone:** pitch. Headlines state conclusions ("Pays for itself in about 56 uses"). There is an "At a glance" summary, an explicit "ask" (approve a pilot) and a closing call-to-action band.
- **Drafted content:** the risk mitigations, "The ask" wording and the hero/pitch copy are AI-drafted, not from the PDF. They are marked `[DRAFTED]` in `content.js` for the group to review.

## Key content from the proposal
- Problem: single-use takeaway packaging waste. BYOC depends on remembering, so people who forget have no reusable option.
- Flow: pay deposit at machine → hand container to stall → return at any participating canteen whose machine isn't full → deposit refunded → canteen washes in commercial dishwashers and redistributes.
- Costs: container $3, utensils $1.50, washing $0.05/wash, set $4.50. A disposable set costs $0.13. Break-even ≈ 56 **uses** (the PDF typo says "users").
- 59% lower climate-change impact after 20 uses (Aggarwal, 2024; full citation in `content.js` → REFERENCES).
- Limitations: high initial cost, low return rate, extra water/electricity/manpower, frequent redistribution, hygiene perception.
- Pilot KPIs: borrowed, returned, avg reuses, damaged/lost, washing & replacement costs, reduction in takeaway containers. Surveys of users, stall owners and staff at the end.

## Project layout
```
cc6 website project/
├── CC0006 Abstract & Proposal.pdf
├── README.md                ← quickstart guide for running the site locally
├── CLAUDE.md                ← this file
├── AI-DECLARATION.md        ← verbatim prompt log for the school AI declaration
├── design-proposals/        ← original static HTML templates A & B (reference only)
│   └── serve.ps1            ← PowerShell static server for previewing them (port 5173)
└── website/                 ← THE REAL SITE (React + Vite)
    ├── index.html           ← fonts, title
    ├── vite.config.js       ← dev server on port 3000
    └── src/
        ├── App.jsx                      ← section order
        ├── styles/global.css            ← all page styles (Template A look + iPad demo)
        ├── data/content.js              ← ALL proposal text & figures (edit wording here)
        ├── data/campus.js               ← map data: roads, canteens, halls, landmarks (illustrative)
        ├── lib/routing.js               ← walking routes (Dijkstra), status, nearest-with-space
        ├── hooks/scroll.js              ← shared scroll listener, sectionProgress, useInView
        ├── hooks/useCanteens.js         ← machine stock state + live simulation
        └── components/
            ├── ui.jsx                   ← <Reveal>, <CountUp>
            ├── map/CampusMap.jsx|css    ← MazeMap-style map (props: data, extraActions, compact, collapsed)
            └── sections/                ← Nav, Hero, Problem, HowItWorks, Demo (iPad), Feasibility, Closing
```

## How to run
```
cd website
npm install      # first time only
npm run dev      # → http://localhost:3000
npm run build    # production build into website/dist (npm run preview to serve it)
npm run lint     # oxlint
```

## Status

### Done
- [x] Proposal read and summarised. Clarifying questions answered.
- [x] Two design templates (A: Fresh Paper, B: Night Loop) built and reviewed. The group chose A's look plus B's demo.
- [x] React + Vite project scaffolded in `website/`. Build and lint are clean.
- [x] Sections: Nav (progress bar and active link), Hero (lid opens on scroll), Problem (disposables pile up, then the reusable box appears), How it works (pinned 5 steps with scenes), **Demo (iPad + OmniBus + map + ReBox wallet)**, Feasibility (count-ups, break-even calculator, 59% ring), Limitations, Pilot (timeline + KPIs), Outcomes, Footer.
- [x] Map expanded. Canteens/food courts: North Spine, South Spine, Quad Café, Canteens 1/2/9/11/13/14/16, North Hill, Crespion and Pioneer. Halls 1–16, Crescent, Pioneer, North Hill, Binjai, Tanjong, Banyan, Saraca and Tamarind. Landmarks: The Hive, Library, Admin, CHC, SRC, NIE, LT Block, RTP and Yunnan Garden. Hall and landmark labels appear when zoomed in.
- [x] Demo flow verified in Chrome: borrow ($5 held) → hand to stall → return (blocked at full machines, which suggest an alternative) → refund → wash and redistribute. No console errors.
- [x] `AI-DECLARATION.md` created with all prompts so far.
- [x] Canteen list checked against public sources (NTU F&B directory, MissTamChiak and SETHLUI NTU guides). Added Canteen 4, Saraca Canteen and NIE Canteen, so the map now has **16 venues**. "Fine Food" is a stall inside South Spine, not a separate venue.
- [x] Full reference found via Crossref and shown in the footer (APA 7): Aggarwal, R. (2024). *Comparative life cycle assessment of reusable and single use take-away lunch boxes used in student restaurants.* Cleaner Environmental Systems, 14, 100223. https://doi.org/10.1016/j.cesys.2024.100223. References and group members now live in `content.js` (`REFERENCES`, `GROUP_MEMBERS`).
- [x] Phone-width pass (tested at 390px): the pile scales down, OmniBus tabs collapse, the map opens zoomed in on the central campus, hall labels only show when zoomed in, and fade-in now works for elements taller than the screen.
- [x] Accessibility pass:
  - map `<svg>` changed from `role="img"` to `role="group"`, so pins are reachable by screen readers
  - keyboard Tab + Enter opens a canteen (verified)
  - `<main>` landmark and "Skip to the interactive demo" link
  - `aria-live` wallet messages
  - visible focus rings
  - map fly-to respects reduced motion
  - 3 low-contrast colours fixed; every text pair checked is now ≥ 4.5:1

### Next / left to do (needs the group)
- [ ] Replace the placeholder names in `GROUP_MEMBERS` (currently Nicholas + Test…Test5).
- [ ] **Review the [DRAFTED] content** in `content.js` (risk mitigations, the ask, pitch copy) and agree on it as a group.
- [ ] Confirm with the group: are "Crespion" and "Pioneer Food Court" one venue? Does Canteen 13 now trade as "13 Bites"? Machine positions, levels and capacities remain placeholders.
- [ ] Optional: the Aggarwal paper also reports **99% more water and 62% more energy** for reusables (from washing), and 3.3% higher cost. This could back up the "More washing" limitation if the group wants to cite it.
- [ ] Optional: presenter mode, "About the team" section, printable one-page summary.
- [ ] Optional: delete `design-proposals/` once the reference templates aren't needed.
- [ ] Not yet tested on a real phone or in Safari/Firefox (only Chrome, including a 390px frame).
