import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textTransform'
})
export class TextTransformPipe implements PipeTransform {

  transform(value: string, txtCase): any {
    if (!value) return value;
    let txtTrans;
    if (txtCase == 'capitalize') {
      txtTrans = value.toLowerCase().split(' ').map(t => t.replace(t[0], t[0].toUpperCase())).join(' ');
    } else if (txtCase == 'uppercase') {
      txtTrans = value.toUpperCase();
    } else {
      txtTrans = value.toLowerCase();
    }
    return txtTrans;
  }

}
