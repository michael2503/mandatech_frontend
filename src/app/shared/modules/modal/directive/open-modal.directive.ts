import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[openModal]'
})
export class OpenModalDirective {
  @Input() openModal

  constructor() { }

  @HostListener('click') onClick() {
    this.openModal.modalParent.nativeElement.classList.add('modalActive');
  }

}
