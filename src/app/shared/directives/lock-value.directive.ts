import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appLockValue]'
})
export class LockValueDirective {
  initValue;
  constructor(private el: ElementRef) {
    setTimeout(() => {
      this.initValue = el.nativeElement.value;
    })
  }

  @HostListener('keydown', ['$event']) onKeydown(e: KeyboardEvent) {
    if (this.el.nativeElement.value.length == this.initValue.length && (e.key == 'Backspace' || e.key == 'ArrowLeft')) {
      e.preventDefault();
    }
  }

}
