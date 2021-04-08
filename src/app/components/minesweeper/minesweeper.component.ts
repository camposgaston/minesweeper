import { Component, OnInit } from '@angular/core';
import { Square } from '../../models/square';


@Component({
  selector: 'app-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.scss']
})
export class MinesweeperComponent implements OnInit {
  // default start values
  rows = 10;
  cols = 10;
  mines = 9;
  field: any[][];
  AdjPositions: number[][] = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  activeMines = 9;
  solved = false;

  constructor() {
    this.field = [];
  }

  ngOnInit(): void {
    this.createField();
  }

  createField(): void {
    for (let row = 0; row < this.rows; row++) {
      this.field[row] = [];
      for (let col = 0; col < this.cols; col++) {
        this.field[row][col] = new Square();
      }
    }
    this.asignMines();
    this.calculateAdjMines();
    this.calculateAllAdjToShow();
    this.activeMines = this.mines;
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
          const adjMines: number = this.AdjPositions
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
    return this.AdjPositions
      .map(position => [row + position[0], col + position[1]])
      .filter(p => p[0] >= 0 && p[0] <= this.rows - 1 && p[1] >= 0 && p[1] <= this.cols - 1)
  }

  getClasses(value: number, status: string): string {
    return `square-${value} ${status}`;
  }

  uncover(row: number, col: number): void {
    if (this.field[row][col].status === 'hidden') {
      this.field[row][col].status = 'visible';

      if (this.field[row][col].value === 0) {
        this.showAdjSquares(this.field[row][col].showsAdj);
      }
      if (this.field[row][col].value === 9) {
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
    if (this.field[row][col].status === 'hidden' && this.activeMines > 0) {
      this.field[row][col].status = 'hidden flagged';
      this.activeMines--;
    } else if (this.field[row][col].status === 'hidden flagged') {
      this.field[row][col].status = 'hidden';
    }
    this.evaluateSolution();
  }
  evaluateSolution() {
    let evalSolved: boolean = true;
    this.field.forEach(arr => {
      arr.forEach(a => {
        if (a.status !== 'visible' && a.value !== 9) {
          evalSolved = false;
        }
      });
    });
    if (evalSolved) {
      this.solvedGame();
    }
  }
  solvedGame() {
    this.solved = true;
  }
}
