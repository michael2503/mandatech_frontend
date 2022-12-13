import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSideNavToggle]'
})
export class SideNavToggleDirective {

  constructor(private el: ElementRef) { }

  @HostListener('click') onClick() {
    this.el.nativeElement.parentElement.classList.toggle('cusShow');
  }

}
