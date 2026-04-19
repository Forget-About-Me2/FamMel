# Melissa Explains It All
Melissa Explains It All is an open source Omorashi game written in html and javascript. The original game was made by drw. The goal of the game is to have the girl
in bed with you while absolutely bursting to pee, while offering lots of interesting scenes along the way.

# Setup
This game is designed to be run on a webserver. In order to run this offline you need to do this through a localhost webserver. A well-known example of a webserver is Apache.
The game is also offered on the following sites:
* [Latest release](https://forget-about-me2.github.io/FamMel/)
* [Latest release](http://fammel.unaux.com/) [mirror]
* [development version](http://famtest.unaux.com/)

# Userflow Tests
End-to-end behavior is verified by Selenium-based NUnit tests in `UserFlowTests/`.

Use these tests to validate player-visible behavior across startup, navigation, choices/actions,
state migration compatibility, and save/load flows.

Quick entry point:

* `UserFlowTests/README.md`


# Debugging
There is a list of usefull debug functions defined in the "debugFunctions.js" file.
These functions are added to a debug object that can be called from the console when running the game.
I.e. to get all items you can use 
`Debug.allItems()`

To get a list of all functions use `Debug.help()`

# Deterministic Testing
Randomness can now be seeded for stable integration tests during refactors.

Use either approach:

* URL query parameter: `http://localhost:8080?seed=12345`
* Runtime call from tests/devtools: `setRandomSeed(12345)`

Reset to a fresh random seed with:

* `clearRandomSeed()`

Notes:

* The game now always starts with a random seed.
* `?seed=12345` (or `setRandomSeed(12345)`) overrides that startup seed.
* Seeded randomness now drives gameplay and animation randomness used by both TS and legacy JS files.

# State Ownership Notes (Migration)

During migration, some gameplay values still exist in two places:

* Canonical typed owner (for example `gameState.Companion.Bladder`)
* Legacy global mirror (for example `bladder`)

When writing state, use compatibility setters such as `setBladder`, `setTummy`, `setYourbladder`, and `setYourtummy`.

Why:

* They route writes to canonical gameState ownership when available.
* They keep legacy global mirrors synchronized for script-style code that has not been migrated yet.
* They prevent split-brain state caused by direct `x = ...` assignments in gameplay logic.

Migration rule of thumb:

* Reads may temporarily come from legacy globals in old scripts.
* Writes should go through compatibility setters (or directly to gameState in fully migrated modules).
