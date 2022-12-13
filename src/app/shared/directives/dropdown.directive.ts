import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  @HostListener('click') onClick() {
    const me = this;
    function dropAuxClick(e) {
      me.dropAuxClick(e);
    }
    this.el.nativeElement.nextElementSibling.classList.toggle('cusShow');
    this.el.nativeElement.parentElement.classList.toggle('shown');
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        document.onclick = dropAuxClick;
      });
    }
  }

  private dropAuxClick(e) {
    const path = e.path || e.composedPath();
    for (let i = 0; i < path.length - 2; i++) {
      if (path[i] == this.el.nativeElement) {
        return;
      }
    }
    this.el.nativeElement.nextElementSibling.classList.remove('cusShow');
    this.el.nativeElement.parentElement.classList.remove('shown');
    document.onclick = null;
  }
}
