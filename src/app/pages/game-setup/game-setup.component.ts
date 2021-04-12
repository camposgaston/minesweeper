import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'app-game-setup',
  templateUrl: './game-setup.component.html',
  styleUrls: ['./game-setup.component.scss']
})
export class GameSetupComponent implements OnInit {


  forma = this.fb.group({
    namePlayer1: ['', [Validators.required, Validators.minLength(5)]],
    namePlayer2: ['', [Validators.required, Validators.minLength(5)]],
    rows: [8, [Validators.required, Validators.min(8), Validators.max(20)]],
    cols: [10, [Validators.required, Validators.min(10), Validators.max(24)]],
    mines: [10, [Validators.required, Validators.min(10), Validators.max(99)]],
    multiplayer: [false],
    level: ['Medium']
  });

  levels = [{ name: 'Easy', rows: 8, cols: 10, mines: 10 },
  { name: 'Medium', rows: 14, cols: 18, mines: 40 },
  { name: 'Hard', rows: 20, cols: 24, mines: 99 },
  { name: 'Defined by Player' }];

  constructor(private fb: FormBuilder, private localstorageService: LocalstorageService, private router: Router) {

  }

  ngOnInit(): void {
    this.forma.controls.namePlayer2.disable();
  }

  namePlayer2ControlStatus() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.forma.controls.multiplayer.value ? this.forma.controls.namePlayer2.disable() : this.forma.controls.namePlayer2.enable();
  }

  get invalidNamePlayer1(): boolean | undefined {
    return this.forma.get('namePlayer1')?.invalid && this.forma.get('namePlayer1')?.touched;
  }

  get invalidNamePlayer2(): boolean | undefined {
    return this.forma.get('namePlayer2')?.invalid && this.forma.get('namePlayer2')?.touched;
  }

  get invalidRows(): boolean | undefined {
    return this.forma.get('rows')?.invalid && this.forma.get('rows')?.touched;
  }

  get invalidCols(): boolean | undefined {
    return this.forma.get('cols')?.invalid && this.forma.get('cols')?.touched;
  }

  get invalidMines(): boolean | undefined {
    return this.forma.get('mines')?.invalid && this.forma.get('mines')?.touched;
  }

  setup(): void {
    if (this.forma.invalid) {
      return Object.values(this.forma.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(controlInstance => controlInstance.markAsTouched());
        }
        control.markAsTouched();
      });
    } else {
      const levelSelected = this.levels.find(l => l.name === this.forma.controls.level.value);
      const cols = levelSelected?.cols ? levelSelected?.cols : this.forma.controls.cols.value;
      const rows = levelSelected?.rows ? levelSelected?.rows : this.forma.controls.rows.value;
      const mines = levelSelected?.mines ?
        levelSelected?.mines :
        this.forma.controls.mines.value > rows * cols / 2 ? rows * cols / 2 : this.forma.controls.mines.value;

      this.localstorageService.setGameOptions(this.forma.controls.namePlayer1.value,
        this.forma.controls.namePlayer2.value, rows, cols, mines, this.forma.controls.level.value);
      this.router.navigate(['game-board']);
    }
  }
}
