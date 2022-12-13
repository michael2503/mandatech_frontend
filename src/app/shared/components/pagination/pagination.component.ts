import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, AfterViewInit {
  @Input() counts = 0;
  @Input() limit = 0;
  @Input() page = 0;

  next: HTMLElement;
  prev: HTMLElement;

  pages: NodeListOf<HTMLElement>;
  numTexts: NodeListOf<HTMLElement>;

  initialPage;

  @ViewChild('paginationPar') paginationPar: ElementRef;

  @Output() setPageEv = new EventEmitter();

  get pageListener() {
    if (this.initialPage != this.page) {
      this.displayCheck();
      this.setActivePage();
      this.initialPage = this.page;
    }
    return '';
  }

  constructor() { }

  ngOnInit(): void {
    this.initialPage = this.page;
  }

  ngAfterViewInit() {
    this.prev = this.paginationPar.nativeElement.querySelector('.pagePrev');
    this.next = this.paginationPar.nativeElement.querySelector('.pageNext');
    this.genPageNum();
  }

  private genPageNum() {
    let firstPage: HTMLElement = this.paginationPar.nativeElement.querySelector('.pages');
    for (let i = 0; i < this.navPageList.length - 1; i++) {
      let cloned = firstPage.cloneNode(true);
      this.paginationPar.nativeElement.insertBefore(cloned, firstPage);
    }
    this.pages = this.paginationPar.nativeElement.querySelectorAll('.pages');
    this.setActivePage();
    this.numTexts = this.paginationPar.nativeElement.querySelectorAll('.numText');
    this.numTexts.forEach((each, i) => {
      each.innerHTML = this.navPageList[i].toString();
    });
    this.displayCheck();
  }

  private setActivePage() {
    this.pages.forEach((each, i) => {
      if (this.navPageList[i] == this.page) {
        each.classList.add('activePage');
      } else {
        each.classList.remove('activePage');
      }
    })
  }

  private eventBinding() {
    if (this.page == 1) {
      this.prev.onclick = null;
    } else {
      this.prev.onclick = () => {
        let page = this.page - 1;
        this.setPageEv.emit(page);
      }
    }
    if (this.page == this.navPageList.slice(-1)[0]) {
      this.next.onclick = null;
    } else {
      this.next.onclick = () => {
        let page = this.page + 1;
        this.setPageEv.emit(page);
      }
    }
    this.numTexts.forEach((each, i) => {
      if (each.innerHTML == '...') {
        this.pages[i].onclick = null;
      } else {
        this.pages[i].onclick = () => {
          this.setPageEv.emit(this.navPageList[i]);
        }
      }
    })
  }

  get navPageList() {
    let pageArray = Array(Math.ceil(this.counts / this.limit)).fill(0).map((c, i) => { return i + 1 });
    return pageArray;
  }

  setCurrPage(page, control = 0) {
    if (control == 0) {
      this.page = page;
    } else if (control == 1) {
      this.page++;
    } else {
      this.page--;
    }
  }

  contentCheck(): void {
    this.numTexts.forEach((each, i) => {
      if ((this.page - (i + 1)) == 1
        || ((i + 1) - this.page) == 1
        || ((i + 1) == this.page)
        || ((i + 1) == this.navPageList[this.navPageList.length - 1])
        || i == 0) {
        each.innerHTML = `${this.navPageList[i]}`;
      } else {
        each.innerHTML = '...';
      }
    });
    this.eventBinding();
  }

  displayCheck(): void {
    this.pages.forEach((each, i) => {
      if (((this.page - (i + 1)) <= 2 && (this.page - (i + 1)) > 0)
        || (((i + 1) - this.page) <= 2 && ((i + 1) - this.page) > 0)
        || ((i + 1) == this.page)
        || ((i + 1) == this.navPageList[this.navPageList.length - 1])
        || i == 0) {
        each.classList.remove('d-none');
      } else {
        each.classList.add('d-none');
      }
    });
    this.contentCheck();
  }

}
