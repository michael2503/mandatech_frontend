import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cleanUrl'
})
export class CleanUrlPipe implements PipeTransform {

  transform(value: string): any {
    if (!value) return value;
    return value.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s/g, '-');
  }

}
