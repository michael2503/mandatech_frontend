import { Pipe, PipeTransform } from '@angular/core';
import { map } from 'rxjs';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';

@Pipe({
    name: 'price',
})
export class PricePipe implements PipeTransform {
    constructor(private genS: GeneralSettingsService) {}

    transform(value: any, dec = 0): any {
        if (!value) return value;
        return this.genS.genSettings.pipe(map(res => {
            return `${res?.currency?.symbol}${this.numberFormat(value, dec)}`;
        }));
    }

    numberFormat(num, dec = 0) {
        num = +num;
        let pref = num < 0 ? '-' : '';
        let numStr = num.toFixed(dec).replace('-', '');
        let intStr = numStr.split('.')[0];
        let convStr = '';
        let count = 0;
        for (let i = intStr.length - 1; i > -1; i--) {
          if (count == 3) {
            convStr = ',' + convStr;
            count = 0;
          }
          convStr = intStr[i] + convStr;
          count++;
        }
        return `${pref}${convStr}${dec > 0 ? '.' + numStr.split('.')[1] : ''}`;
      }
}
