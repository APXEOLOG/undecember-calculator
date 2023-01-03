# Undecember Damage Calculator
## Overview
This is the damage calculator tool for the `Undecember` game.

The current implementation has no user-friendly UI and only supports DoT damage (mainly Toxic Flame skill)

The good things is that it does so considering all mods and equipments with 100% precision

The calculator features:
- Calculate damage with 100% precision without going to the training dummy
- Everything that affects character can be defined individually (mastery, gear, charms, relics, zodiac, etc) 
- Support for the effects (Overpower, Acceleration, Mental Stimulation, etc) and effects "effect"
- Full support for the elemental penetration and monster resistances (100% precision against lvl 1 and lvl 100)
- Support for the Shock and other "Increased Damage Taken" effects

The possible use cases:
- Play with different zodiac nodes to determine the best DPS one without doing the actual respec
- Determine whether gear will give you more DPS before buying it
- Compare different support runes and understand their real damage benefit
- Understand the benefit of different mods on your damage (e.g. will 5% amplification give more damage than 60% increased damage?)

## How to use
This is a Typescript/NodeJS app
1. Pull the repo
2. `npm install`
3. `npm start`

Check [src/index.ts](./src/index.ts) to see the example definition of the input data (based on my character)

- First, construct the `Environment` that contains all mods that affect your damage
- Then call `calculateForSkill` from the [src/calculation/calculation-pipeline.ts](src/calculation/calculation-pipeline.ts)
- ... or just overwrite the index file and invoke it via `npm start`

## Implementation Details
- Basic damage calculation pipeline (flat values, increases, amplifications, dampenings)
- Tag-based system to determine what mods are applicable to the calculation
- `Environment` class is a basic class to store and filter mods based on tags
- `ModSource` interface is used to track the source of the mod (great for debug)
