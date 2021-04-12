import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { IScore, Score } from '../../models/score';
@Component({
  selector: 'app-finished-games-list',
  templateUrl: './finished-games-list.component.html',
  styleUrls: ['./finished-games-list.component.scss']
})
export class FinishedGamesListComponent implements OnInit {

  public scores: IScore[] = [];
  public sortedScores: IScore[] = [];
  constructor(private localstorageService: LocalstorageService) { }

  ngOnInit(): void {
    this.scores = this.localstorageService.scores;
    this.sortedScores = [...this.scores.filter(a => a.status === 'Won')].sort((a, b) => b.score - a.score);
    this.sortedScores = [...this.sortedScores, ...[...this.scores.filter(a => a.status === 'Lost')].sort((a, b) => b.score - a.score)];
  }
}
