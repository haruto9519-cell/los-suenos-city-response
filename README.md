# LOS SUENOS: CITY RESPONSE

A browser-based 3D public-safety response game prototype. This original project is independent from the user's other repositories.

## Current playable slice

- Three.js 3D city block with roads, sidewalks, buildings, street furniture, vehicles and a civic assembly plaza.
- First-person movement and mouse-look.
- One guided public-assistance mission: approach three residents, offer assistance, and accompany them to the marked community assembly point.
- Enterable community response center with a reception counter, public seating, windows and interior lighting.
- Basic movement collision around parked vehicles and the response-center structure.
- Branching resident conversations: explain the situation, ask about individual needs, or offer to accompany each resident.
- Residents follow the player in a loose formation after accepting an escort; the player must lead them into the marked community plaza to complete the mission.
- Mission HUD, progress tracking, pause/resume and completion screen.
- Incident command radio check: establish dispatch communications with R before offering an escort; command status is shown in the HUD.
- Responsive interface; keyboard and mouse are currently the intended control scheme.

## Controls

- **W / A / S / D** — Move
- **Mouse** — Look around (click the game view if pointer lock is not active)
- **E** — Offer assistance when near a resident
- **Shift** — Move faster
- **Esc** — Pause

## Run locally

Serve this folder with any static web server. Because the game uses JavaScript ES modules, opening index.html directly as a file URL may be blocked by the browser. The Three.js module is loaded from jsDelivr.

## Publish with GitHub Pages

1. Open the repository Settings.
2. Open Pages.
3. Under Build and deployment, select Deploy from a branch.
4. Select branch main and folder /(root), then Save.
5. Wait for GitHub Pages to finish publishing; the public URL will appear in the Pages settings.

## Roadmap

1. Expand collision coverage to street furniture, building corners and NPC navigation.
2. Add conversation memory and more varied assistance outcomes.
3. Add additional enterable buildings and richer environmental storytelling.
4. Add additional districts, mission scenarios and persistent progression.
5. Improve character animation, lighting, audio and performance.

## Project status

This is an early playable prototype, not a finished commercial game. The current mission focuses on public assistance, evacuation, communication and civilian safety.
