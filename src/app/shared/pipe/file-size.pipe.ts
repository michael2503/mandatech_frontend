import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  transform(value: any, dec = 1): any {
    if (value < 1024) {
      return `${value.toFixed(dec)} Bytes`
    } else if (value / 1024 < 1024) {
      return `${(value / 1024).toFixed(dec)} KB`;
    } else if (value / (1024 * 1024) < 1024) {
      return `${(value / (1024 * 1024)).toFixed(dec)} MB`;
    } 
    return `${(value / (1024 * 1024 * 1024)).toFixed(dec)} GB`;
  }

}
