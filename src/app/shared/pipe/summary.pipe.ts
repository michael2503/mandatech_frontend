import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summary'
})
export class SummaryPipe implements PipeTransform {

  transform(value: string, num: number) {
    if (value) {
      return `${value.slice(0, num)}${value.length > num ? '...' : ''}`;
    }
    return value;
  }

}
