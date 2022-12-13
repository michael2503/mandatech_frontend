import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appPassToggle]',
})
export class PassToggleDirective {
  @Input() appPassToggle;
  @Input() iconToggle = true;

  constructor(private el: ElementRef) {}

  @HostListener('click') onClick() {
    let input = this.appPassToggle;
    input.type = input.type == 'text' ? 'password' : 'text';
    if (this.iconToggle) {
      this.el.nativeElement.classList.toggle('fa-eye');
      this.el.nativeElement.classList.toggle('fa-eye-slash');
    } else {
      this.el.nativeElement.innerHTML = input.type == 'text' ? 'Hide' : 'Show';
    }
  }
}
