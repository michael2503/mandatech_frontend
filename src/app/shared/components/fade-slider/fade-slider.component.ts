import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-fade-slider',
  templateUrl: './fade-slider.component.html',
  styleUrls: ['./fade-slider.component.scss'],
})
export class FadeSliderComponent implements OnInit, AfterViewInit {
  @ViewChild('fadeParent') fadeParent: ElementRef;
  slideItems: NodeListOf<HTMLElement>;
  indicators: NodeListOf<HTMLElement>;
  prev: HTMLElement;
  next: HTMLElement;
  activeInd = 0;
  autoSlideVar;
  @Input() autoSlide = true;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.slideItems =
      this.fadeParent.nativeElement.querySelectorAll('.slideItem');
    this.indicators =
      this.fadeParent.nativeElement.querySelectorAll('.indicatorItem');
    this.next = this.fadeParent.nativeElement.querySelector('.next');
    this.prev = this.fadeParent.nativeElement.querySelector('.prev');
    this.eventBinding();
    let hArr = [];
    this.slideItems.forEach((each) => {
      each.classList.add('slideActive');
    });
    setTimeout(() => {
      this.slideItems.forEach((each) => {
        hArr.push(+getComputedStyle(each).height.replace('px', ''));
      });
      this.slideItems.forEach((each) => {
        each.firstElementChild['style'].minHeight = `${Math.max(...hArr)}px`;
      });
      this.fadeSlide();
      if (this.autoSlide) {
        this.startAutoSlide();
      }
    }, 600);
  }

  private eventBinding() {
    const me = this;
    function indSlide(i) {
      me.indSlide(i);
    }
    function slide(n) {
      me.slide(n);
    }
    function startAutoSlide() {
      me.startAutoSlide();
    }
    function stopAutoSlide() {
      me.stopAutoSlide();
    }
    this.next.addEventListener('click', () => {
      slide(1);
    });
    this.prev.addEventListener('click', () => {
      slide(-1);
    });
    this.fadeParent.nativeElement.addEventListener('mouseenter', stopAutoSlide);
    this.fadeParent.nativeElement.addEventListener(
      'mouseleave',
      startAutoSlide
    );
    if (this.indicators) {
      this.indicators.forEach((each, i) => {
        each.addEventListener('click', () => {
          indSlide(i);
        });
      });
      this.setInd();
    }
  }

  private startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideVar = setInterval(() => {
      this.slide(1);
    }, 5000);
  }

  private stopAutoSlide() {
    clearInterval(this.autoSlideVar);
  }

  private indSlide(n) {
    this.activeInd = n;
    this.fadeSlide();
    this.setInd();
  }

  private setInd() {
    this.indicators.forEach((each, i) => {
      if (i == this.activeInd) {
        each.classList.add('indiActive');
      } else {
        each.classList.remove('indiActive');
      }
    });
  }

  private slide(n) {
    this.activeInd += n;
    this.activeInd =
      this.activeInd < 0
        ? this.activeInd - 1
        : this.activeInd == this.slideItems.length
        ? 0
        : this.activeInd;
    this.fadeSlide();
    if (this.indicators) {
      this.setInd();
    }
  }

  private fadeSlide() {
    this.slideItems.forEach((each, i) => {
      if (i == this.activeInd) {
        each.classList.add('slideActive');
      } else {
        each.classList.remove('slideActive');
      }
    });
  }
}
