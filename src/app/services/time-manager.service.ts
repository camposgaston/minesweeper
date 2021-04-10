import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable, timer } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class TimeManagerService {

  constructor() { }

  get now(): string {
    return moment().format('DD-MM-YYYY hh:mm a');
  }

  get countSeconds$(): Observable<number> {
    return timer(0, 1000);
  }

}
