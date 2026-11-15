# LOS SUENOS: CITY RESPONSE

A browser-based 3D public-safety response game prototype. This original project is independent from the user's other repositories.

## Current playable slice

- Three.js 3D city block with roads, sidewalks, buildings, street furniture, vehicles and a civic assembly plaza.
- First-person movement and mouse-look.
- Three documented civilian contacts: explain confirmed information, listen to individual needs, and close each contact with a recorded outcome.
- Enterable community response center with a reception counter, public seating, windows and interior lighting.
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

1. Expand collision coverage to street furniture, building corners and NPC navigation.
2. Add conversation memory and more varied assistance outcomes.
3. Add additional enterable buildings and richer environmental storytelling.
4. Add additional districts, mission scenarios and persistent progression.
5. Improve character animation, lighting, audio and performance.

## Project status

This is an early playable prototype, not a finished commercial game. The current mission focuses on civilian contact, information verification, welfare needs, dispatch coordination and incident documentation.

- Timed dispatch updates: after radio contact and team briefing, utility-status verification and resident-welfare coordination updates arrive during the mission. Player responses are recorded in the radio transcript.

- Live team status: role-specific coordination, resident-support and welfare-liaison activity states update during the response.
- After-action report: completion screen summarizes mission duration, decision score, dispatch updates resolved, information-verification choices, support actions and residents safely assisted.

- Scenario selection: choose between a Civic Quarter power outage, Riverside severe-weather response and Central Station transit disruption. Each scenario has its own briefing, sector label and timed dispatch updates while retaining the shared resident-support gameplay loop.


## Direction update — police incident-response simulation
The project direction is now a fictional police special-response unit simulator with a grounded procedural tone inspired by Ready or Not's presentation and mission structure. The current playable loop focuses on dispatch communication, civilian interviews, welfare needs, verified information, documented contact outcomes and incident reporting. It does not model real-world weapon handling, tactical entry or assault procedures.

The call-out selector offers Civic Quarter Welfare Check, Civic Quarter Missing Person Follow-up, and Market Street Commercial Alarm. These currently share the existing Civic Quarter environment and three-contact casework loop; unique maps and distinct mission-specific NPC behavior remain future work.


## Pre-deployment preparation
Added a pre-deployment preparation panel with selectable protective equipment, communications equipment and support equipment. The selected configuration is logged at call-out acceptance and included in the after-action report. This is a presentation and continuity feature; selections do not provide real-world tactical guidance or change weapon capabilities.

## Incident casework update
The previous escort-to-plaza objective has been replaced. Each contact now requires an explanation of confirmed information, a conversation about individual needs, and an explicit documented close-out. Dispatch updates must also be acknowledged before the incident can be closed. The after-action report records completed contacts and verified information.
