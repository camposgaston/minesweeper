# Minesweeper

Minesweeper is a grid of tiles, each of which may or may not cover hidden mines.
The goal is to click on every tile except those that have mines. When a user clicks a tile, one of two things happens: if the tile was covering a mine, the mine is revealed and the game ends in failure; if the tile was not covering a mine, it instead reveals the number of adjacent tiles (including diagonals) that are covering mines - and, if that number is 0, it behaves as if the user has clicked on every cell around it.

With each turn, the game is validated:

If the player uncovers a bomb tile, the player loses and the game ends.
If the player uncovers a non-bomb tile (number) and there are remaining non-bomb tiles uncovered, the game continues. Otherwise, the player wins.

Play with a friend setting multiplayer option

Enjoy!

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
