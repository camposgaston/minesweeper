import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedGamesListComponent } from './finished-games-list.component';

describe('FinishedGamesListComponent', () => {
  let component: FinishedGamesListComponent;
  let fixture: ComponentFixture<FinishedGamesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishedGamesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishedGamesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
