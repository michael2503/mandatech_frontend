import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string): any {
    if (!value) return value;
    let present = Date.now();
    let inpDate = Date.parse(value.replace('Z', ''));
    let diff = present - inpDate;
    let count;
    if (diff / 1000 < 60) {
      count = Math.floor(diff / 1000);
      return `${count} second${count > 1 ? 's' : ''} ago`;
    } else if (diff / 1000 >= 60 && diff / 1000 < 3600) {
      count = Math.floor(diff / (1000 * 60));
      return `${count} minute${count > 1 ? 's' : ''} ago`;
    } else if (diff / 1000 >= 3600 && diff / 1000 < 3600 * 24) {
      count = Math.floor(diff / (1000 * 3600));
      return `${count} hour${count > 1 ? 's' : ''} ago`;
    } else if (diff / 1000 >= 3600 * 24 && diff / 1000 < 3600 * 24 * 7) {
      count = Math.floor(diff / (1000 * 3600 * 24));
      return `${count} day${count > 1 ? 's' : ''} ago`;
    } else {
      count = Math.floor(diff / (1000 * 3600 * 24 * 7));
      return `${count} week${count > 1 ? 's' : ''} ago`;
    }
  }

}
