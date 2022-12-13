import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'app-cus-accordion',
    templateUrl: './cus-accordion.component.html',
    styleUrls: ['./cus-accordion.component.scss'],
})
export class CusAccordionComponent implements OnInit, AfterViewInit {
    @ViewChild('acc') cusAcc: ElementRef;
    @Output() onOpenEv = new EventEmitter();

    constructor() {}

    ngOnInit(): void {}

    ngAfterViewInit() {
        const accHead = this.cusAcc.nativeElement.children[0];
        accHead.addEventListener('click', () => {
            const items = accHead.nextElementSibling.children;
            if (
                accHead.classList.contains('cusCollapsed') ||
                !accHead.nextElementSibling.classList.contains('cusShow')
            ) {
                this.onOpenEv.emit();
                let totalH = 0;
                for (let i = 0; i < items.length; i++) {
                    let eachH = +getComputedStyle(items[i]).height.replace(
                        'px',
                        ''
                    );
                    let mt = +getComputedStyle(items[i]).marginTop.replace(
                        'px',
                        ''
                    );
                    let mb = +getComputedStyle(items[i]).marginBottom.replace(
                        'px',
                        ''
                    );
                    totalH += eachH + mt + mb;
                }
                accHead.nextElementSibling.style.height = `${totalH}px`;
                accHead.nextElementSibling.classList.add('cusShow');
                accHead.classList.remove('cusCollapsed');
                setTimeout(() => {
                    accHead.nextElementSibling.style.height = 'auto';
                }, 300);
            } else {
                let initial = accHead.nextElementSibling.clientHeight;
                accHead.nextElementSibling.style.height = `${initial}px`;
                accHead.nextElementSibling.classList.remove('cusShow');
                accHead.classList.add('cusCollapsed');
                setTimeout(() => {
                    accHead.nextElementSibling.style.height = '';
                });
            }
        });
    }
}
