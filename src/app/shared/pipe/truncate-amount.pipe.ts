import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateAmount'
})
export class TruncateAmountPipe implements PipeTransform {

  transform(value: number, dec = 2): unknown {
    if (!value) return value;
    if (value < 1000) {
      return value.toFixed(dec);
    } else if (value / 1000 < 1000) {
      return `${(value / 1000).toFixed(dec)}K`;
    } else if (value / (1000 * 1000) < 1000) {
      return `${(value / (1000 * 1000)).toFixed(dec)}M`;
    } else if (value / (1000 * 1000 * 1000) < 1000) {
      return `${(value / (1000 * 1000 * 1000)).toFixed(dec)}B`;
    } else {
      return `${(value / (1000 * 1000 * 1000 * 1000)).toFixed(dec)}T`;
    }
  }

}
