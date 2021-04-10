import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showTime'
})
export class ShowTimePipe implements PipeTransform {

  transform(value: number): string {
    const date = new Date(value * 1000);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;

  }

}
