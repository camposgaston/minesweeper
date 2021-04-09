import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { MinesweeperComponent } from './components/minesweeper/minesweeper.component';
import { GameSetupComponent } from './pages/game-setup/game-setup.component';
import { GameBoardComponent } from './pages/game-board/game-board.component';
import { FinishedGamesListComponent } from './pages/finished-games-list/finished-games-list.component';
import { HeaderComponent } from './shared/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    MinesweeperComponent,
    GameSetupComponent,
    GameBoardComponent,
    FinishedGamesListComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
