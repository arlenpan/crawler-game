### Game input loop:

Initial loop:
1. Initialize board
2. Initialize player
3. Render board/player

Phases:
1. User input (handleSelectTile)
2. Pop tiles (handleDeselectTiles)
3. Process tiles
* Player deals damage, resolve effects
* Monsters deal damage
* Resolve deaths and post damage effects
* Clear board

4. Update board + rerender
5. Update player + rerender
* Check win/loss states
* opportunity to upgrade player?
* back to step 1

### Gameplay loop

1. Player plays turn
2. Resolve turn effects
3. Every (10?) turns, player gets to choose a path (2-3 options)
- Go to storekeeper (spend coins, weaker item)
- Search for treasure (roll for random item)
- Rest (heal)
- Tempt fate (change odds)

### Game design:

First player choice (class):
- 4 ? unique classes
- more unlockable ones?
- classes should have enough depth to play very differently - e.g. StS
- stick to one for now until we can design differently

Second player choice (upgrades):
- how do we get to player power fantasy?
- card choices for upgrades?
- bind player stat upgrades to different cards?

Different avenues of specialization/upgrades
- (spells) - usable abilities with mana costs and CDR
- (runes) - drawable patterns that create effects
- (equipment) - passive effects that make you stronger
- (fate) - changing what is generated

Enemies:
- 

Generating satisfaction + power fantasy
- create a win condition (defeating a final boss)
- after winning, prestige levels with same character
- creating choices during leveling

Random ass ideas
- upgrade that creates a clock timer?
- drawing certain patterns that create spells? 