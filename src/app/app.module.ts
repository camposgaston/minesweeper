import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { MinesweeperComponent } from './components/minesweeper/minesweeper.component';
import { GameSetupComponent } from './pages/game-setup/game-setup.component';
import { GameBoardComponent } from './pages/game-board/game-board.component';
import { FinishedGamesListComponent } from './pages/finished-games-list/finished-games-list.component';
import { HeaderComponent } from './shared/header/header.component';
import { ShowTimePipe } from './pipes/show-time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MinesweeperComponent,
    GameSetupComponent,
    GameBoardComponent,
    FinishedGamesListComponent,
    HeaderComponent,
    ShowTimePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
