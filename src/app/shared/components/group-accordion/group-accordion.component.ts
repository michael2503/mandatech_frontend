import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-group-accordion',
    templateUrl: './group-accordion.component.html',
    styleUrls: ['./group-accordion.component.scss'],
})
export class GroupAccordionComponent implements OnInit, AfterViewInit {
    @Input() listener: BehaviorSubject<number>;
    @ViewChild('accGroup') accGroup: ElementRef;
    accHeads: NodeListOf<HTMLElement>;

    constructor() {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.accHeads =
            this.accGroup.nativeElement.querySelectorAll('.accHead');
        this.listener.subscribe((i) => {
            if (i > -1) {
                this.accHeads.forEach((el, j) => {
                    if (i != j && !el.classList.contains('cusCollapsed')) {
                        el.click();
                    }
                });
            }
        });
    }
}
