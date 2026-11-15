# LOS SUENOS: CITY RESPONSE

A browser-based 3D public-safety response game prototype. This original project is independent from the user's other repositories.

## Current playable slice

- Three.js 3D city block with roads, sidewalks, buildings, street furniture and vehicles.
- First-person movement and mouse-look.
- Five distinct call-outs: residential welfare, missing-person follow-up, commercial alarm, transit-hub welfare and a public-space disagreement.
- Fifteen named civilian contacts with scenario-specific accounts and support needs. Explain confirmed information, listen to individual needs, and close each contact with a recorded outcome.
- Enterable civic response center with a reception counter, public seating, windows and interior lighting.
- Basic movement collision around parked vehicles and the response-center structure.
- Branching resident conversations: explain the situation, ask about individual needs, or offer to accompany each resident.
- Contact records update the live case roster and radio transcript; the incident closes only after all three contacts and both dispatch updates are documented.
- Mission HUD, progress tracking, pause/resume and completion screen.
- Incident command radio check: establish dispatch communications with R before offering an escort; command status is shown in the HUD.
- Response-team assignments: give three distinct coordination, resident-liaison and medical-liaison responsibilities, select the mission task and issue a team briefing before escort activity.
- Radio traffic log records dispatch check-ins, team briefings and resident-assistance updates.
- Responsive interface; keyboard and mouse are currently the intended control scheme.

## Controls

- **W / A / S / D** — Move
- **Mouse** — Look around (click the game view if pointer lock is not active)
- **E** — Open a contact conversation when near a person
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

1. Add promotion milestones, additional personnel and more call-out scenarios.
2. Add conversation memory and more varied assistance outcomes.
3. Add additional enterable buildings and richer environmental storytelling.
4. Add additional districts, mission scenarios and persistent progression.
5. Improve character animation, lighting, audio and performance.

## Project status

This is an early playable prototype, not a finished commercial game. The current mission focuses on civilian contact, information verification, welfare needs, dispatch coordination and incident documentation. The former plaza escort marker and follow-the-player objective have been removed.

- Timed dispatch updates: after radio contact and team briefing, utility-status verification and resident-welfare coordination updates arrive during the mission. Player responses are recorded in the radio transcript.

- Live team status: role-specific coordination, resident-support and welfare-liaison activity states update during the response.
- After-action report: completion screen summarizes mission duration, decision score, dispatch updates resolved, information-verification choices, support actions and residents safely assisted.

- Scenario selection: choose between a Civic Quarter power outage, Riverside severe-weather response and Central Station transit disruption. Each scenario has its own briefing, sector label and timed dispatch updates while retaining the shared resident-support gameplay loop.


## Direction update — police incident-response simulation
The project direction is now a fictional police special-response unit simulator with a grounded procedural tone inspired by Ready or Not's presentation and mission structure. The current playable loop focuses on dispatch communication, civilian interviews, welfare needs, verified information, documented contact outcomes and incident reporting. It does not model real-world weapon handling, tactical entry or assault procedures.

The call-out selector offers Civic Quarter Welfare Check, Civic Quarter Missing Person Follow-up, and Market Street Commercial Alarm. Each call-out now loads its own three named contacts, opening statements and information needs. These currently share the existing Civic Quarter environment and three-contact casework loop; unique maps and distinct mission-specific NPC behavior remain future work.


## Pre-deployment preparation
Added a pre-deployment preparation panel with selectable protective equipment, communications equipment and support equipment. The selected configuration is logged at call-out acceptance and included in the after-action report. This is a presentation and continuity feature; selections do not provide real-world tactical guidance or change weapon capabilities.

## Persistent unit career and post-call debrief
After a completed call-out, the player can return to the operations room. The station displays a local career record: completed calls, earned experience, commendations and the latest result. The record is stored in the current browser using local storage; clearing browser data resets it. A return-to-station transition is available from the completion report. Each of the three named unit members has independent experience, rank, level, fatigue, morale and call-out count. Rank milestones are Officer, Senior Officer, Corporal and Sergeant. Their experience reflects assigned liaison/coordinator responsibilities; fatigue recovers at the station. Department funds start at $100,000; each completed call-out incurs $1,800 in operating costs and receives a performance grant ($5,200 for Excellent, $4,000 for Commendable, or $2,800 for Completed).

## 3D operations room
The player begins in a furnished Unit 04 operations room with a wall briefing display, workstations and three visible unit members. The player reviews the team panel, issues a distinct-responsibility briefing and then deploys to the city. Mission timing and dispatch updates begin on deployment, not while standing in the station.

## Incident casework update
The previous escort-to-plaza objective has been replaced. Each contact now requires an explanation of confirmed information, a conversation about individual needs, and an explicit documented close-out. Dispatch updates must also be acknowledged before the incident can be closed. The after-action report records completed contacts and verified information.

## Immersion / test-build pass
- Added an optional procedural ambient audio bed, radio acknowledgement tones and soft movement footsteps; audio starts only after the player enters the experience and can be muted from the top bar.
- Added street furniture, planters, bins, road markings and district signage to give the playable block more visual landmarks.
- Added subtle first-person movement head-bob and a responsive audio control.
- Audio is synthesized locally with Web Audio; no external sound files or tracking services are used.

- Added a post-call lifecycle: after returning to the operations room, select a new call-out. Mission counters, dispatch updates, resident states, briefing and contact records reset without resetting saved career progression. Re-deploying a completed incident is blocked.
- Audio now reuses one Web Audio context and fades the ambient layer in/out instead of creating a new context on every toggle.
