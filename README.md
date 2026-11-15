# SAN VEGA CITY — POLICE SIMULATOR

A browser-based 3D police-life simulation prototype set in the fictional West Coast city of San Vega. This is a new direction replacing the previous Los Suenos response prototype.

## Current playable slice
- Compact, expandable American West Coast city block with roads, sidewalks, storefronts, apartments, trees, streetlights and parked traffic.
- Small San Vega Police Department station, roll-call desk and patrol forecourt.
- First-person and third-person camera toggle.
- PC keyboard/mouse controls and touch controls for phones/tablets.
- Start a day-watch shift, check in at roll call and collect the marked patrol vehicle.
- Simplified patrol-car driving and vehicle entry/exit.
- Thirteen pedestrians follow staggered sidewalk waypoint routes, turn at route ends and remain on the sidewalk corridors; conversation prompts remain available.
- Six ambient vehicles moving through the main roads.
- Coordinated two-axis traffic lights with green, yellow and red phases; ambient cars stop at the intersection line when their direction is not permitted.
- Dispatch sign-on, one routine neighborhood-assistance call, scene marker, arrival report and resident conversation.
- Contact-documentation flow and shift log.
- Test-only automation hooks enabled only on localhost with the e2e query parameter.

## Controls
PC: WASD walk or drive; mouse look; Shift move faster; E interact or enter/exit vehicle; V toggle first/third person.
Mobile: left virtual stick to move; drag on 3D view to look; ACTION to interact; VIEW to toggle camera.

## Test
Serve the repository root over HTTP on port 4173 and open http://127.0.0.1:4173/?e2e=1. The automation helper is exposed only on localhost.

## Scope
This is an early playable slice, not a finished open-world game. Next work expands district size, interiors, traffic and civilian behavior, career systems, dispatch variety, audio, saving and device-specific optimization. The simulation focuses on communication, public assistance, documentation and lawful procedures; it does not implement real-world weapon handling or tactical combat.