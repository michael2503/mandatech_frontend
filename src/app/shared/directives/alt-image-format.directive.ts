import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';

@Directive({
  selector: '[appAltImageFormat]',
})
export class AltImageFormatDirective {
  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        let img = el.nativeElement.firstChild;
        if (img) {
          let imgs =
            img.parentElement.parentElement.parentElement.parentElement.querySelectorAll(
              'img'
            );
          imgs.forEach((img) => {
            let prevUrl = img.src;
            img.onerror = () => {
              if (img.src.match(/\.webp$/)) {
                // img.src = 'assets/freelancers/profile-default.png';
                img.onerror = null;
                return;
              }
              img.src = prevUrl.replace(/\.[a-z]+$/i, '.webp');
            };
          });
        }
      }
    });
  }

  @HostListener('error', ['$event']) onError(e) {
    let prevUrl = e.target.src;
    if (prevUrl.match(/\.webp$/)) {
      // e.target.src = 'assets/freelancers/profile-default.png';
      return;
    }
    e.target.src = prevUrl.replace(/\.[a-z]+$/i, '.webp');
  }
}
