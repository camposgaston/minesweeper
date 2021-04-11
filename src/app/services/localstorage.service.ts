import { Injectable } from '@angular/core';
import { Score, IScore } from '../models/score';
import { IGameOptions } from '../models/game-options';


@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  getStartData(): void {

  }


  get scores(): IScore[] {
    return localStorage.getItem('scores') ? JSON.parse(localStorage.getItem('scores') || '') : [];
  }

  saveScore(score: number,
    player: string,
    level: 'Easy' | 'Medium' | 'Hard' | 'Defined by Player',
    difficulty: number,
    startTime: string,
    endTime: string,
    spentTime: number,
    status: 'Won' | 'Lost'): void {
    const newScore: IScore = new Score(score, player, level, difficulty, startTime, endTime, spentTime, status);
    localStorage.setItem('scores', JSON.stringify([...this.scores, newScore]));
  }

  setGameOptions(namePlayer1: string, namePlayer2: string, rows: number, cols: number, mines: number,
    level: 'Easy' | 'Medium' | 'Hard' | 'Defined by Player'): void {
    const gameOptions: IGameOptions[] = [{ namePlayer1, namePlayer2, rows, cols, mines, level }];
    localStorage.setItem('gameOptions', JSON.stringify(gameOptions));
  };

  get gameOptions(): IGameOptions[] {
    return localStorage.getItem('gameOptions') ? JSON.parse(localStorage.getItem('gameOptions') || '') : [];
  }

}


