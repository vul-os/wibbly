# Multiplayer & anti-cheat

> **Status, split two ways.** The *local* half is implemented: the tracker returns up to six
> skeletons and `SpatialBinder` gives them durable ids, under 29 unit tests — but nothing has been
> validated against real people in a real room, and tennis still drives one player. The *networked*
> half does not exist: there is no client, no transport and no session code in wibbly at all. The
> anti-cheat section is written down before it is built, deliberately, so the boundary is agreed
> rather than discovered.

There are two distinct problems here. Conflating them is the usual mistake.

## Local — same camera, 2–4 players

The differentiated, fun case, and the one that ships first. The input layer for it now exists.

It falls out of two things: `PoseTracker.maxPeople` returning up to six people, and `PlayerBinder`
giving those skeletons durable identity. MoveNet MultiPose makes it cheap because its cost curve is
flat — a fourth player in frame costs the same inference time as the first. See
[Model selection](/products/wibbly/docs/models).

What makes it hard is not the model, it is the binding. A frame gives you six anonymous skeletons; a
game needs to know that the skeleton on the left is still player one after they ducked behind player
two. `SpatialBinder` does greedy nearest-centroid matching over torso centroids, with a per-player
claim zone and a forget timeout for occlusion. Claim zones are **sticky**: once you own one you keep
your id even after walking out of it, which is what stops two players swapping identity when they
cross.

Two honest caveats. First, the binder has 18 passing tests and zero minutes in front of a real camera
— occlusion and crossover are precisely where fixtures flatter an implementation. Second, the tennis
game is configured with two claim zones but reads gestures for `player_1` only, so a second person
cannot actually play yet. Wiring that up is the next task.

## Networked — different cameras

Each client runs its own tracker locally and transmits **`GestureEvent`s, not video**.

This is a privacy property worth stating loudly and precisely: *camera frames never leave the
device*. Not because of a policy, but because there is no code path that would send them, and no
latency budget that would tolerate one. A gesture event is a player id, a string, a float, a vector
and a timestamp — tens of bytes at gesture rate, versus roughly 250 MB/s for raw 1080p at 30 fps.

Session hosting, discovery and lobbies come from [magnetite](https://github.com/vul-os/magnetite)
through an `InputProvider` seam. That seam has not been added to magnetite, and no wibbly code talks
to magnetite today.

## The anti-cheat boundary — be honest about this

magnetite's replay verification assumes **deterministic input**: given the same inputs, the same
simulation produces the same result, so a replay can be re-executed and checked. That is the property
magnetite sells.

**Gesture input is a nondeterministic sensor stream and cannot be replay-verified.** Two runs of the
same model over the same camera will not necessarily agree, and there is no canonical "input" to
replay in the first place — only what one client's tracker happened to report.

So gesture games run **client-attested**:

- The host simulates authoritatively over the `GestureEvent`s it receives.
- Events are **rate-limited** — you cannot swing forty times a second.
- Events are **plausibility-checked** — human-reachable velocities, respected cooldowns, positions
  inside a calibrated reach envelope.
- **A determined cheater can still synthesise events.** Nothing in the pipeline proves that a
  `GestureEvent` came from a real arm in front of a real camera.

That last bullet is the point of this page. It is documented rather than implied away, because a
guarantee wibbly cannot keep is worse than an honest limit. Competitive formats that need stronger
assurance need a different input class — or a referee, or in-person play, which camera games are
unusually well suited to anyway.
