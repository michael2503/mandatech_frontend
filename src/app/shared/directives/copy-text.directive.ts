import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appCopyText]'
})
export class CopyTextDirective {
  @Input() inputEl;
  @Input() textBtn = false;
  constructor(private el: ElementRef) {
    const me = this;
    el.nativeElement.setAttribute('title', 'Copy');
    setTimeout(() => {
      this.inputEl.addEventListener('blur', resetCopy);
    });
    function resetCopy() {
      const me = this;
      if (el.nativeElement.getAttribute('title') == 'Copied') {
        document.oncopy = resetBtn;
      }
      function resetBtn() {
        if (this.textBtn) {
          el.nativeElement.innerHTML = 'Copy';
        }
        el.nativeElement.setAttribute('title', 'Copy');
        document.oncopy = null;
      }
    }
  }

  @HostListener('click') copyText() {
    this.inputEl.select();
    this.inputEl.setSelectionRange(0, 99999);
    document.execCommand('copy');
    if (this.textBtn) {
      this.el.nativeElement.innerHTML = 'Copied';
    }
    this.el.nativeElement.setAttribute('title', 'Copied');
  }
}
