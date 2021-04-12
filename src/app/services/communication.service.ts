import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IEvent } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private subject = new Subject<any>();

  newEvent(event: IEvent) {
    this.subject.next(event);
  }

  get events$() {
    return this.subject.asObservable();
  }

  sendSimpleEvent(name: string, player2Addressed: boolean) {
    const event = { name, player2Addressed };
    this.newEvent(event);
  }

}
