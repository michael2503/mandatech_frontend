import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { OpenModalDirective } from './directive/open-modal.directive';



@NgModule({
  declarations: [
    ModalComponent,
    OpenModalDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModalComponent,
    OpenModalDirective,
  ]
})
export class ModalModule { }
