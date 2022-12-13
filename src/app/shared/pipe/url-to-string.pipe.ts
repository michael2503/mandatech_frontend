import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlToString'
})
export class UrlToStringPipe implements PipeTransform {

  transform(value: any): string {
    const str = value.trim();
    if (str) {
      return str.replace(/[^a-zA-Z0-9 &+,._-]/g, '').split('&').join('and')
        .split(' + ').join(' ').split('+ ').join(' ').split('+').join(' ')
        .split(', ').join(' ').split(',').join(' ')
        .split('-').join(' ').split(' - ').join(' ').split('- ').join(' ').split(' -').join(' ')
        .toLowerCase().replace(/^-/g, '');
    } else {
      return '';
    }
  }

}
