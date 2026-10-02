# NTU Reusable Container Scheme: Quickstart

The interactive website for our CC0006 proposal on a deposit-based reusable container system for NTU canteens.
It runs **locally on your own computer**, so no hosting or internet account is needed.

---

## 1. Install Node.js (one-time)

1. Go to **https://nodejs.org** and download the **LTS** version (v22 or newer).
2. Run the installer and keep all the default options.
3. **Close and reopen** any terminal windows so they pick up Node.
4. Check it worked: open a terminal and run

   ```
   node -v
   ```

   You should see something like `v22.x.x` or `v24.x.x`. The site needs **Node 20.19+ or 22.12+**.

> **Which terminal?**
> - **Windows:** press Start, type **cmd**, and open *Command Prompt*.
> - **Mac:** press ⌘ + Space, type **Terminal**, and open it.
> - **VS Code:** use *Terminal → New Terminal*.

---

## 2. Open the project folder in the terminal

Move into the `website` folder inside this project, changing the path to wherever the folder is on *your* computer:

```
cd "C:\Users\<you>\Documents\NTU mods\Y2S1\CC6\cc6 website project\website"
```

**Tip:** on Windows you can open File Explorer in the `website` folder, click the address bar, type `cmd` and press Enter.
A terminal opens already in the right place.

---

## 3. Install packages (first time only)

```
npm install
```

This downloads the libraries into a `node_modules` folder and takes about a minute.
You only need to run it again if someone adds a new package.

---

## 4. Start the website

```
npm run dev
```

Then open **http://localhost:3000** in your browser (Chrome recommended).

- Leave the terminal open while you use the site. Closing it stops the site.
- Saved changes to the code show up in the browser **instantly**; you don't need to restart.
- **To stop:** click the terminal and press **Ctrl + C**.

---

## 5. Using the demo

Click **Try the demo** in the top bar (or scroll to section **04 · The product**) to find the iPad demo:

| Action | How |
|---|---|
| See a canteen's machine | Click a pin on the map |
| Borrow a container | Click a pin, then **Borrow here · $5.00** |
| Hand to stall | **Hand container to stall** in the wallet panel |
| Return it | Click a canteen with space, then **Return here** |
| Find somewhere to return | **Nearest spot with space** |
| Move / zoom the map | Drag to pan, **Ctrl + scroll** (or the + / − buttons) to zoom |
| Start over | **Reset demo** |

North Spine is set to **full** on purpose, to show the "return elsewhere" suggestion.
Capacity numbers change every few seconds to simulate other students.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `'node' is not recognized` / `command not found: npm` | Node isn't installed, or the terminal was open during install. Close all terminals and open a new one. |
| PowerShell error: *"running scripts is disabled on this system"* | Use **Command Prompt** (cmd) instead of PowerShell, or run `npm.cmd run dev` instead of `npm run dev`. |
| `vite` is not recognized / `Cannot find module` | You skipped step 3. Run `npm install` in the `website` folder. |
| Port 3000 is already in use | Vite picks the next free port (e.g. 3001). Use the address the terminal prints. |
| `npm install` fails part-way | Delete the `node_modules` folder and `package-lock.json`, then run `npm install` again. |
| Page is blank after editing `content.js` | Text must be **in quotes**: `['Nicholas', 'Alex']`, not `[Nicholas, Alex]`. Also check commas between items and matching brackets. Press **F12 → Console** in the browser to see the exact error and line. |
| Page is blank (other) | Check the terminal and the browser console (F12) for a red error message. It's usually a typo in a recently edited file. |

---

## Editing the content

You don't need to know React to change the text:

| What | File |
|---|---|
| All proposal text, costs, steps, risks & mitigations, KPIs, outcomes (AI-drafted items are marked `[DRAFTED]`) | `website/src/data/content.js` |
| **Group member names** (`GROUP_MEMBERS`), site title (`TITLE`), references | `website/src/data/content.js` |
| Canteens, halls and map layout | `website/src/data/campus.js` |
| Colours and styling | `website/src/styles/global.css` |

Save the file and the browser updates automatically.

---

## Optional: build a final version

```
npm run build     # creates an optimised copy in website/dist
npm run preview   # serves that copy at the address shown in the terminal
```

Use this for the final presentation if you want the fastest, most stable version.

## Sharing the project with groupmates

Zip the whole project folder but **leave out `website/node_modules`** (it's huge and gets rebuilt by `npm install`).
Your groupmates then follow steps 1 to 4 above.

---

## Other files in this folder

| File | What it is |
|---|---|
| `CC0006 Abstract & Proposal.pdf` | Our original proposal, the source of all content |
| `AI-DECLARATION.md` | Log of every prompt given to the AI tool, for the AI-use declaration |
| `CLAUDE.md` | Project status and notes (what's done and what's left) |
| `design-proposals/` | The two original design templates (reference only) |
