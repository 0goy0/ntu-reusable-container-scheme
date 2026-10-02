# AI Use Declaration: CC0006 Website Project

This log records every prompt our group gave to the AI tool while building the project website, in order and verbatim (typos kept as typed), plus the tool's clarifying questions and our answers.

## Tool used
- **Tool:** Claude Code (Anthropic's AI coding assistant, command-line version), running on our own Windows laptop
- **Model:** Claude Opus 5.5 (`claude-opus-5-5`)
- **Additional tool:** the "Claude in Chrome" browser extension, used by the AI to open the site locally and check that it works
- **Source material given to the AI:** our own proposal, `CC0006 Abstract & Proposal.pdf`

> **Note on "system prompts":** Claude Code also runs with built-in system instructions written by Anthropic (general rules for how the assistant behaves and uses its tools). We did not write, see or change these, so they are not reproduced here. Everything *we* instructed is recorded below.

---

## Session 1: 23 September 2026

### Prompt 1
> navigate to C:\Users\Nicholas\Documents\NTU mods\Y2S1\CC6\cc6 website project

**AI output:** Opened the project folder and listed its contents (only the proposal PDF).

### Prompt 2
> Task: Read the proposal and understand the contents

**AI output:** A summary of the proposal (problem, solution, feasibility, limitations, implementation, outcomes). It checked the break-even maths (≈56 uses) and pointed out typos in the PDF ("users" should be "uses", "cost-effectuive", "Feasbility") and the unstated deposit amount.

### Prompt 3
> Based on the proopsal, I intend  to create an interactive website for my group project. The website should be hosted locally and be interactive as you scroll. I also want a map integration following the proposal. Ask any clarifying questions and update claude.md on the status of the website including what has been done and what is left. Start with 2 template proposals for the design and show them to me.

**Clarifying questions asked by the AI, and our answers:**

| AI question | Our answer |
|---|---|
| Which map approach should the website use for the canteen/return-machine locations? | "I need something similar to mazemap in illustration and to show that something like this can be integrated" |
| What tech stack should the site be built with (hosted locally either way)? | React + Vite |
| What is the website's main job? | Both (scroll-story presentation + interactive product demo) |
| What deposit amount should the site show? | $5 |

**AI output:** Two static HTML design templates. Template A, "Fresh Paper", is light and editorial. Template B, "Night Loop", is dark, with a phone demo. Both share a MazeMap-style illustrative campus map. The AI also wrote a chooser page, a small local preview server script and the `CLAUDE.md` status file, and tested both templates in Chrome.

### Prompt 4
> 1. Go with template A's look but integrate with B's phone demo but make it a larger screen size like an ipad. 2. The name can be a placeholder 3. Node.js has been installed 4. Do include all canteens and some halls in the map. 5. Due to this being a school project, I need you to record all the system prompts to include in our declaration.

**AI output:** Built the final React + Vite website in `website/`, using Template A's look. It merged in Template B's borrow/return demo, now on an iPad-sized tablet mock-up. The map was expanded to include NTU canteens/food courts and hall buildings (layout illustrative). The AI also created this declaration file and updated `CLAUDE.md`.

### Prompt 5
> Please continue the still to do list

**AI output:** Worked through the remaining to-do list:
- **Web research:** checked the canteen list against public sources and added 3 missing venues to the map.
- **Citation:** confirmed the full Aggarwal (2024) citation via Crossref and added a References list to the footer.
- **Phones:** tested the site at phone width and fixed layout issues.
- **Accessibility:** screen-reader access to the map, keyboard use, skip link, reduced motion, and colour-contrast fixes.

**Sources the AI consulted:** NTU "F&B, Retail & Services" directory (ntu.edu.sg), MissTamChiak "Ultimate Guide to Good Food in NTU", SETHLUI "NTU food guide", Crossref record for DOI 10.1016/j.cesys.2024.100223.

### Prompt 6
> Help add a readme for the quickstart guide to running the website locally

**AI output:** Wrote `README.md` in the project folder: a step-by-step quickstart for running the website locally (install Node.js, install packages, start, stop, build), plus troubleshooting and where to edit content.

### Prompt 7
> Changed group member names and saved the js but now getting blank page when assessing site

**AI output:** Found the cause: the name in `GROUP_MEMBERS` was typed without quotes (`[Nicholas]`), which crashed the page on load. Changed it to `['Nicholas']`, added an example in the code comment, and added this case to the README troubleshooting table.

### Prompt 8
> Help make the website more professional. Ask any clarifying questions.

**AI output:** Listed the parts of the site that look unpolished and asked clarifying questions in a pop-up. We dismissed the pop-up.

### Prompt 9
> Help make the website more professional. Ask any clarifying questions.

**AI output:** Asked the clarifying questions as plain chat text instead. *(Answers and changes recorded under the next prompt.)*

### Prompt 10
> 1b make it more like a pitch, 2 all, 3a, 4b. Use any tools or workflows that might make it more polished

*(Our answers: 1b = pitch tone; 2 all = visual polish, formal/pitch copy rewrite, at-a-glance summary, risk mitigations; 3a = keep custom illustrations but make them cleaner; 4b = neutral title instead of a brand name.)*

**AI output:** Redesigned the site as a pitch titled "NTU Reusable Container Scheme":
- **New sections:** a numbered-section layout, hero key figures, an "At a glance" summary with "the ask", a risks & mitigations section, and a closing call to action.
- **Copy:** rewrote headlines and body text in a pitch tone. All figures stay from our proposal.
- **Drafted content (we must review):** the risk mitigations, "the ask" and the pitch wording are new content written by the AI. They are marked `[DRAFTED]` in `website/src/data/content.js`.
- **Visuals:** replaced the text-symbol icons with the Lucide icon set, redrew the illustrations in a cleaner style, removed the looping animations, and bundled the fonts so they work offline.
- **Tools used:** a colour-blindness palette validator (it changed the chart's "disposable" colour) and Google Lighthouse. Final Lighthouse scores: Performance 96, Accessibility 100, Best Practices 100, SEO 100.

---

## What the AI produced vs. what we did
- **Our work:** the proposal content (problem, solution, costs, limitations, pilot plan, outcomes), design choices and direction (the answers above), and review of the output. *(Group: add anything else you did, e.g. editing text, checking data, presenting.)*
- **AI-generated:** website code (HTML/CSS/JavaScript/React), the illustrated SVG graphics, the illustrative campus-map layout, and the demo interactions. All facts and figures on the site come from our proposal. The map positions, machine capacities, floor levels and walking times are made-up placeholders for demonstration.
