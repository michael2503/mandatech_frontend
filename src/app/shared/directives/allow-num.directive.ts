import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAllowNum]'
})
export class AllowNumDirective {

  constructor(private el: ElementRef) {
  }

  @HostListener('keydown', ['$event']) onKeydown(e: KeyboardEvent) {
    if (isNaN(+e.key)) {
      if (e.key) {
        if (e.key.length < 2 && e.key != "+") {
          e.preventDefault();
        }
      } else {
        setTimeout(() => {
          if (isNaN(+this.el.nativeElement.value)) {
            this.el.nativeElement.value = "";
          }
        }, 10);
      }
    }
  }

  @HostListener('paste', ['$event']) onPaste(e) {
    if (isNaN(+e.clipboardData.getData('Text'))) {
      e.preventDefault();
    }
  }

}
