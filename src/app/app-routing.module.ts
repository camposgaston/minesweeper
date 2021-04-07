import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinishedGamesListComponent } from './pages/finished-games-list/finished-games-list.component';
import { GameBoardComponent } from './pages/game-board/game-board.component';
import { GameSetupComponent } from './pages/game-setup/game-setup.component';

const routes: Routes = [
  { path: 'game-setup', component: GameSetupComponent },
  { path: 'game-board', component: GameBoardComponent },
  { path: 'finished-games-list', component: FinishedGamesListComponent },
  { path: '**', component: GameBoardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
