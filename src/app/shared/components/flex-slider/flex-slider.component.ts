import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';

@Component({
  selector: 'app-flex-slider',
  templateUrl: './flex-slider.component.html',
  styleUrls: ['./flex-slider.component.scss']
})
export class FlexSliderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('carouselParent') carouselParent: ElementRef;
  flexCont: HTMLElement;
  slideItems: NodeListOf<HTMLElement>;
  prev: HTMLElement;
  next: HTMLElement;


  @Input() slideResizeConfig;
  @Input() autoSlide = true;
  @Input() infiniteSlide = true;
  @Input() delay = 100;

  autoSlideVar;

  percExt = .2;

  draggable = false;
  @Input() enableDrag = true;

  initialSlidePos = 0;
  draggingPos = 0;
  initialXPos;
  minPos;
  showSlideNo;

  spaceBtwItem;
  slideExt;
  parW;
  flexW;

  dragEvHolder;
  stopDragEvHolder;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.winResEv(false);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.flexCont = this.carouselParent.nativeElement.querySelector('.flexCont');
        this.slideItems = this.flexCont.querySelectorAll(':scope > .carouselItem');
        this.next = this.carouselParent.nativeElement.querySelector('.next');
        this.prev = this.carouselParent.nativeElement.querySelector('.prev');
        this.responsive();
        this.winResEv(true);
      }
    }, this.delay);
  }

  private winResEv(add) {
    const me = this;
    function resize() {
      me.responsive();
    }
    if (add) {
      window.addEventListener('resize', resize);
    } else {
      window.removeEventListener('resize', resize);
    }
  }

  private responsive() {
    this.parW = +getComputedStyle(this.carouselParent.nativeElement).width.replace('px', '');
    let pL = +getComputedStyle(this.carouselParent.nativeElement).paddingLeft.replace('px', '');
    let pR = +getComputedStyle(this.carouselParent.nativeElement).paddingRight.replace('px', '');
    this.parW = this.parW - pL - pR;
    this.percExt = window.innerWidth < 600 ? .1 : .2;
    this.spaceBtwItem = +getComputedStyle(this.slideItems[0]).marginRight.replace('px', '');
    let condition = '';
    for (let eachConf of this.slideResizeConfig) {
      if (!eachConf.maxW) {
        condition += `if (this.parW >= ${eachConf.minW}) {
          this.genSlideNo(${eachConf.slideNo});
        }`
      } else if (!eachConf.minW) {
        condition += `if (this.parW < ${eachConf.maxW}) {
          this.genSlideNo(${eachConf.slideNo});
        }`
      } else {
        condition += `if (this.parW >= ${eachConf.minW} && this.parW < ${eachConf.maxW}) {
          this.genSlideNo(${eachConf.slideNo});
        }`
      }
    }
    eval(condition);
  }

  startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideVar = setInterval(() => {
      this.slide(1);
    }, 5000);
  }

  stopAutoSlide() {
    clearInterval(this.autoSlideVar);
  }

  private cloneCtrl(add) {
    if (add) {
      this.slideItems.forEach(each => {
        let clone = each.cloneNode(true);
        clone['classList'].add('clone');
        this.flexCont.appendChild(clone);
      });
      this.slideItems = this.flexCont.querySelectorAll(':scope>.carouselItem');
    } else {
      this.slideItems.forEach(each => {
        if (each.classList.contains('clone')) {
          each.remove();
        }
      });
      this.slideItems = this.flexCont.querySelectorAll(':scope>.carouselItem');
    }
  }


  private genSlideNo(no) {
    let slideItmNo = [].slice.call(this.slideItems).filter(each => !each.classList.contains('clone')).length;
    let clonesNo = [].slice.call(this.slideItems).filter(each => each.classList.contains('clone')).length;
    if (slideItmNo > no) {
      this.eventBinding(true);
      if (!clonesNo && this.infiniteSlide) {
        this.cloneCtrl(true);
      }
    } else {
      this.eventBinding(false);
      if (this.infiniteSlide) {
        this.cloneCtrl(false);
      }
    }
    let eachW = (this.parW - ((no - 1) * this.spaceBtwItem)) / no;
    this.slideItems.forEach((each) => {
      each.style.width = `${eachW}px`;
    });
    this.showSlideNo = no;
    this.slideExt = eachW + this.spaceBtwItem;
    this.flexW = this.slideExt * this.slideItems.length;
    this.flexCont.style.width = `${this.flexW}px`;
    this.flexCont.style.left = '0px';
    this.initialSlidePos = 0;
    this.draggingPos = 0;
    this.minPos = (this.flexW - this.spaceBtwItem - this.parW) * -1;
  }

  private eventBinding(bind) {
    if (bind) {
      this.draggable = true;
      this.prev.onclick = () => {
        this.slide(-1);
      }
      if (!this.infiniteSlide) {
        this.prev.classList.add('d-none');
        this.next.classList.remove('d-none');
      }
      this.next.onclick = () => {
        this.slide(1);
      }
      if (this.autoSlide && this.infiniteSlide) {
        this.startAutoSlide();
      }
    } else {
      this.draggable = false;
      this.prev.onclick = null;
      this.next.onclick = null;
      this.prev.classList.add('d-none');
      this.next.classList.add('d-none');
    }
  }

  dragStart(e) {
    const me = this;
    let target = e.target;
    if (target.classList.contains('prev') ||
      target.classList.contains('next') ||
      target.parentElement.classList.contains('prev') ||
      target.parentElement.classList.contains('next')
    ) return;
    if (e.type != 'touchstart') {
      e.preventDefault();
      this.percExt = .2;
    } else {
      this.percExt = .1;
    }
    this.carouselParent.nativeElement.style.cursor = "grab";
    this.initialXPos = e.type == 'mousedown' ? e.x : e.touches[0].clientX;
    this.flexCont.style.transition = "0s";
    this.dragEvHolder = drag;
    this.stopDragEvHolder = stopDrag;
    if (e.type == 'touchstart') {
      this.stopAutoSlide();
    }

    function drag(e) {
      me.drag(e);
    }
    function stopDrag(e) {
      me.dragEnd(e);
    }
    if (e.type == 'mousedown') {
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stopDrag);
    } else {
      document.addEventListener('touchmove', drag);
      document.addEventListener('touchend', stopDrag);
    }
  }

  private drag(e) {
    let currPos = e.type == 'mousemove' ? e.x : e.touches[0].clientX;
    let diff = currPos - this.initialXPos;
    this.initialXPos = currPos;
    let finalPos = this.draggingPos + diff;
    if (!this.infiniteSlide) {
      if ((finalPos > 0 && diff > 0) || (this.draggingPos < this.minPos && diff < 0)) {
        finalPos = this.draggingPos + (diff * 0.1);
      }
    } else {
      if ((finalPos > 0 && diff > 0) || (this.draggingPos < this.minPos && diff < 0)) {
        if (diff > 0) {
          finalPos = (this.slideExt * (this.slideItems.length / 2)) * -1;
        } else {
          finalPos = -1 * (this.slideExt * ((this.slideItems.length / 2) - this.showSlideNo));
        }
        this.initialSlidePos = finalPos;
      }
    }
    this.draggingPos = finalPos;
    this.flexCont.style.left = `${finalPos}px`;
  }

  private dragEnd(e) {
    const me = this;
    if (e.type == 'mouseup') {
      document.removeEventListener('mousemove', me.dragEvHolder);
      document.removeEventListener('mouseup', me.stopDragEvHolder);
    } else {
      document.removeEventListener('touchmove', me.dragEvHolder);
      document.removeEventListener('touchend', me.stopDragEvHolder);
    }
    this.carouselParent.nativeElement.style.cursor = 'default';
    let isA = false;
    let path = e.path || e.composedPath();
    for (let i = 0; i < path.length - 2; i++) {
      if (path[i].tagName == 'A' && path[i].href != 'javascript:void(0)') {
        isA = true;
      }
    }
    if (!this.infiniteSlide) {
      if (this.draggingPos > 0) {
        if (isA) {
          e.target.onclick = (s) => {
            s.stopPropagation();
            s.preventDefault();
          }
        }
        this.flexCont.style.transition = "0.2s ease";
        this.flexCont.style.left = "0px";
        this.draggingPos = 0;
        this.initialSlidePos = 0;
        this.prev.classList.add('d-none');
        this.next.classList.remove('d-none');
        return;
      } else if (this.draggingPos < this.minPos) {
        if (isA) {
          e.target.onclick = (s) => {
            s.stopPropagation();
            s.preventDefault();
          }
        }
        this.flexCont.style.transition = "0.2s ease";
        this.flexCont.style.left = `${this.minPos}px`;
        this.draggingPos = this.minPos;
        this.initialSlidePos = this.minPos;
        this.next.classList.add('d-none');
        this.prev.classList.remove('d-none');
        return;
      }
    }
    let slideDiff, finalPos;
    this.flexCont.style.transition = '0.3s ease';
    if (this.draggingPos < this.initialSlidePos) {
      slideDiff = (this.initialSlidePos - this.draggingPos) % this.slideExt;
      if (slideDiff > this.percExt * this.slideExt) {
        finalPos = this.draggingPos - (this.slideExt - slideDiff);
      } else {
        this.flexCont.style.transition = '0.2s ease';
        finalPos = this.draggingPos + slideDiff;
      }
      if (!this.infiniteSlide) {
        if (+finalPos.toFixed(2) <= +this.minPos.toFixed(2)) {
          this.next.classList.add('d-none');
          this.prev.classList.remove('d-none');
        } else {
          this.next.classList.remove('d-none');
          this.prev.classList.remove('d-none');
        }
      }
    } else if (this.draggingPos > this.initialSlidePos) {
      slideDiff = (this.draggingPos - this.initialSlidePos) % this.slideExt;
      if (slideDiff > this.percExt * this.slideExt) {
        finalPos = this.draggingPos + (this.slideExt - slideDiff);
      } else {
        this.flexCont.style.transition = '0.2s ease';
        finalPos = this.draggingPos - slideDiff;
      }
      if (!this.infiniteSlide) {
        if (+finalPos.toFixed(0) >= 0) {
          this.prev.classList.add('d-none');
          this.next.classList.remove('d-none');
        } else {
          this.next.classList.remove('d-none');
          this.prev.classList.remove('d-none');
        }
      }
    } else {
      if (isA) {
        e.target.onclick = null;
      }
    }
    if (finalPos != undefined) {
      if (isA) {
        e.target.onclick = (s) => {
          s.stopPropagation();
          s.preventDefault();
        }
      }
      this.flexCont.style.left = `${finalPos}px`;
      this.draggingPos = finalPos;
      this.initialSlidePos = finalPos;
    }
    if (e.type == 'touchend' && this.autoSlide && this.infiniteSlide) {
      this.startAutoSlide();
    }
  }

  private slide(n) {
    if (!this.infiniteSlide) {
      if ((n == 1 && +this.initialSlidePos.toFixed(2) <= +this.minPos.toFixed(2)) || (n == -1 && +this.initialSlidePos.toFixed(0) >= 0)) return;
      if (n == 1) {
        this.prev.classList.remove('d-none');
      }
      if (n == -1) {
        this.next.classList.remove('d-none');
      }
    }
    let finalPos = this.initialSlidePos - (n * this.slideExt);
    if (this.infiniteSlide) {
      let resetPos;
      if ((finalPos < this.minPos && n == 1) || (finalPos > 0 && n == -1)) {
        if (finalPos < this.minPos && n == 1) {
          resetPos = this.slideExt * ((this.slideItems.length / 2) - this.showSlideNo);
        } else {
          resetPos = this.slideExt * (this.slideItems.length / 2);
        }
        this.flexCont.style.transition = '0s';
        this.flexCont.style.left = `-${resetPos}px`;
        finalPos = -resetPos - (n * this.slideExt);
      }
    }
    setTimeout(() => {
      this.flexCont.style.transition = '0.6s ease';
      this.flexCont.style.left = `${finalPos}px`;
      this.initialSlidePos = finalPos;
      this.draggingPos = finalPos;
      if (!this.infiniteSlide) {
        if (n == 1 && +this.initialSlidePos.toFixed(2) <= +this.minPos.toFixed(2)) {
          this.next.classList.add('d-none');
        }
        if (n == -1 && this.initialSlidePos >= 0) {
          this.prev.classList.add('d-none');
        }
      }
    }, 10);
  }

}
