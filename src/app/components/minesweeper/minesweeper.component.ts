import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IGameOptions } from 'src/app/models/game-options';
import { Square, ISquare } from '../../models/square';
import { LocalstorageService, } from '../../services/localstorage.service';
import { TimeManagerService } from '../../services/time-manager.service';
import { CommunicationService } from '../../services/communication.service';
import { IEvent } from '../../models/event';


@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.scss']
})
export class MinesweeperComponent implements OnInit, OnDestroy {
  @Input() player2 = false;

  rows = 10;
  cols = 10;
  mines = 9;
  level: 'Easy' | 'Medium' | 'Hard' | 'Defined by Player' = 'Medium';
  field: ISquare[][];
  adjPositions: number[][] = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  availableFlags = 9;
  solved = false;

  startTime = '';
  endTime = '';
  playerName = '';
  timerValue = 0;
  spentTime = 0;
  uncoveredNonBombSquares = 0;
  timerSubscription: Subscription | undefined;



  gameStatus: 'On Hold Finished' | 'On Hold Ready' | 'Finished' | 'Paused' | 'Playing' | 'Ready' | 'Waiting Player' = 'Ready';
  constructor(
    private localstorageService: LocalstorageService,
    private timeManagerService: TimeManagerService,
    private router: Router,
    private communicationService: CommunicationService
  ) {
    this.field = [];
  }

  ngOnInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.localstorageService.gameOptions.length === 0 ? this.router.navigate(['game-setup']) :
      this.localstorageService.gameOptions[0].namePlayer2 === '' && this.player2 ? this.gameStatus = 'Waiting Player' :
        this.player2 === this.localstorageService.savedGame[2] ? this.gameStatus = 'Paused' :
          this.createField();

    this.communicationService.events$.forEach((event: IEvent) => {
      if (event.name === 'waitForTheOtherPlayer' && event.player2Addressed === !this.player2) {

        this.gameStatus = this.gameStatus === 'Finished' ? 'On Hold Finished' : 'On Hold Ready';
      }
      if (event.name === 'yourTurnToPlay' && event.player2Addressed === !this.player2) {
        this.gameStatus = this.gameStatus === 'On Hold Finished' ?
          'Finished' :
          this.localstorageService.gameOptions[0].namePlayer2 === '' && this.player2 ? this.gameStatus = 'Waiting Player' :
            'Ready';
      }
    });

  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  createField(): void {
    const gameOptions: IGameOptions = this.localstorageService.gameOptions[0];
    this.timerValue = 0;
    this.spentTime = 0;
    this.startTime = '';
    this.endTime = '';
    this.rows = gameOptions.rows;
    this.cols = gameOptions.cols;
    this.mines = gameOptions.mines;
    this.playerName = this.player2 ? gameOptions.namePlayer2 : gameOptions.namePlayer1;
    this.level = gameOptions.level;

    this.field = [];
    for (let row = 0; row < this.rows; row++) {
      this.field[row] = [];
      for (let col = 0; col < this.cols; col++) {
        this.field[row][col] = new Square();
      }
    }
    this.asignMines();
    this.calculateAdjMines();
    this.calculateAllAdjToShow();
    this.availableFlags = this.mines;
    this.gameStatus = 'Ready';
  }

  randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  asignMines(): void {
    // max mines quantity = half the squares
    this.mines = (this.cols * this.rows) / 2 > this.mines ? this.mines : (this.cols * this.rows) / 2;
    let availableMines = this.mines;

    do {
      const randomRow = this.randomIntFromInterval(0, this.rows - 1);
      const randomCol = this.randomIntFromInterval(0, this.cols - 1);

      // mined squares have 9 as value
      if (this.field[randomRow][randomCol].value < 9) {
        this.field[randomRow][randomCol].value = 9;
        availableMines--;
      }
    } while (availableMines > 0);
  }

  calculateAdjMines(): void {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.field[row][col].value < 9) {
          const adjMines: number = this.adjPositions
            .map(position => [row + position[0], col + position[1]])
            .filter(p => p[0] >= 0 && p[0] <= this.rows - 1 && p[1] >= 0 && p[1] <= this.cols - 1)
            .reduce((acum, redPosition) => this.field[redPosition[0]][redPosition[1]].value === 9 ? ++acum : acum, 0);
          this.field[row][col].value = adjMines;
        }
      }
    }
  }

  calculateAllAdjToShow(): void | number[][] {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.field[row][col].value === 0) {
          this.field[row][col].showsAdj = this.calculateAdjSquares(row, col);
        }
      }
    }
  }

  calculateAdjSquares(row: number, col: number): number[][] {
    return this.adjPositions
      .map(position => [row + position[0], col + position[1]])
      .filter(p => p[0] >= 0 && p[0] <= this.rows - 1 && p[1] >= 0 && p[1] <= this.cols - 1);
  }

  getClasses(value: number, status: string): string {
    return `square-${value} ${status}`;
  }

  uncover(row: number, col: number): void {
    if (!this.startTime) {
      this.startTime = this.timeManagerService.now;
      this.timerSubscription = this.timeManagerService.countSeconds$.subscribe((data: number) => this.timerValue = data);
      this.gameStatus = 'Playing';
      this.communicationService.sendSimpleEvent('waitForTheOtherPlayer', this.player2);
    }
    if (this.field[row][col].status === 'hidden' && !this.solved) {
      this.field[row][col].status = 'visible';

      if (this.field[row][col].value === 0) {
        this.showAdjSquares(this.field[row][col].showsAdj);
        this.availableFlags = this.mines;
        this.field.forEach(arr => { this.availableFlags -= arr.filter(s => s.status === 'hidden flagged').length; });
      }

      if (this.field[row][col].value === 9) {
        this.field.forEach(arr => { this.uncoveredNonBombSquares += arr.filter(s => s.status === 'visible').length; });
        this.finishedGame('Lost');
        this.field.forEach(arr => { arr.forEach(a => a.status = 'visible'); });
        this.field[row][col].status = 'detonated detonation';
      } else {
        this.evaluateSolution();
      }
    }
  }

  showAdjSquares(showsAdj: number[][]): void {
    let allSquaresToShow = [...showsAdj];
    do {
      allSquaresToShow.forEach(array => {
        let arrayToAdd: number[][] = [];
        if (this.field[array[0]][array[1]].value === 0) {
          arrayToAdd = this.calculateAdjSquares(array[0], array[1]);
        }
        allSquaresToShow = [...allSquaresToShow, ...arrayToAdd]
          .filter(p => this.field[p[0]][p[1]].status !== 'visible');
        this.field[array[0]][array[1]].status = 'visible';
      });
    } while (allSquaresToShow.length > 0);
  }

  flag(row: number, col: number): void {
    if (this.field[row][col].status === 'hidden' && this.availableFlags > 0) {
      this.field[row][col].status = 'hidden flagged';
      this.availableFlags--;
    } else if (this.field[row][col].status === 'hidden flagged') {
      this.field[row][col].status = 'hidden';
      this.availableFlags++;
    }
  }
  evaluateSolution(): void {
    let evalSolved = true;
    this.field.forEach(arr => {
      arr.forEach(a => {
        if (a.status !== 'visible' && a.value !== 9) {
          evalSolved = false;
        }
      });
    });
    if (evalSolved) {
      this.solved = true;
      this.finishedGame('Won');
    }
  }

  finishedGame(status: 'Won' | 'Lost'): void {
    this.spentTime = this.timerValue;
    this.endTime = this.timeManagerService.now;
    this.gameStatus = 'Finished';
    const minesDensity = this.mines / (this.rows * this.cols);
    const difficulty = minesDensity * this.mines;
    const uncoveredNonBombSquaresPerc = status === 'Won' ? 1 : this.uncoveredNonBombSquares / (this.rows * this.cols);
    const playingTimeGivesNoPoints = 5 * 60;
    const scoredByTime = status === 'Won' ? (1 / (this.spentTime / playingTimeGivesNoPoints)) * difficulty : 0;
    const score = uncoveredNonBombSquaresPerc * difficulty + scoredByTime;
    this.localstorageService.saveScore(score, this.playerName, this.level,
      difficulty, this.startTime, this.endTime, this.spentTime, status);
    this.timerSubscription?.unsubscribe();
    this.communicationService.sendSimpleEvent('yourTurnToPlay', this.player2);
  }

  playAgain() {
    this.createField();
  }

  resumeGame() {
    const savedGame = this.localstorageService.savedGame;
    if (this.player2 === savedGame[2]) {
      this.timerValue = savedGame[0] - 1;
      this.field = savedGame[1];
      this.gameStatus = 'Playing';
      this.timerSubscription = this.timeManagerService.countSeconds$.subscribe((data: number) => this.timerValue++);
    } else {
      this.newGameSameoptions();
    }
  }

  newGameSameoptions() {
    this.gameStatus = 'Ready';
    this.createField();
  }

  pauseGame() {
    this.localstorageService.pauseGame(this.timerValue, this.field, this.player2);
    this.timerSubscription?.unsubscribe();
    this.gameStatus = 'Paused';
  }

  settings() {
    this.router.navigate(['game-setup']);
  }
}
