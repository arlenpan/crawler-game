### Organization

Page Wrapper -> Page -> Game
Game -> Renderer -> Event Handler -> Game

### State

* Board State
* Character state:
  - Health
  - Power?
  - Accumulated shield
  - Coins


### Game Loop
1. Board gets generated
2. Player inputs action
3. STATE UPDATE - PLAYER + BOARD
5. Monster triggers action
6. STATE UPDATE - PLAYER + BOARD
7. repeat (#2) until termination

Termination States:

- 0 Health
- Win level?