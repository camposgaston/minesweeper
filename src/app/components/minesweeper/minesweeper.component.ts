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
    console.log(this.field);
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
          const adjMines: number = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
            .map(position => [row + position[0], col + position[1]])
            .filter(filterPosition => filterPosition[0] >= 0 && filterPosition[0] <= this.rows - 1 && filterPosition[1] >= 0 && filterPosition[1] <= this.cols - 1)
            .reduce((acum, redPosition) => this.field[redPosition[0]][redPosition[1]].value === 9 ? ++acum : acum, 0);
          this.field[row][col].value = adjMines;
        }
      }
    }
  }



}
