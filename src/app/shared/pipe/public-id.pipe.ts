import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'publicId',
})
export class PublicIdPipe implements PipeTransform {
  transform(value: string, def = null): any {
    let val = value || def;
    if (!val) return value;
    if (val.match(/\/v\d+/) || val.split('/').length > 7) {
      return val
        .split('/')
        .slice(-2)
        .map((u) => u.split('.')[0])
        .join('/');
    }
    return val.split('/').slice(-1)[0].split('.')[0];
  }
}
