import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bvnDecode'
})
export class BvnDecodePipe implements PipeTransform {

  transform(value: string): any {
    if (!value) return value;
    let normalStr = '';
    for (let i = 9; i < value.length; i += 12) {
      normalStr += value.slice(i, (i + (i != 45 ? 3 : 2)));
    }
    let search = ['F', 'M', 'H', 'A', 'Z', 'K', 'O', 'B', 'P', 'T'];
    let replace = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    search.forEach((l, i) => {
      normalStr = normalStr.replace(new RegExp(l, 'g'), replace[i]);
    });
    return normalStr;
  }

}
