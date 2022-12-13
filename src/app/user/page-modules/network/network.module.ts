import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NetworkRoutingModule } from './network-routing.module';
import { DirectReferralsComponent } from './direct-referrals/direct-referrals.component';
import { BinaryTreeComponent } from './binary-tree/binary-tree.component';
import { UnilevelStructureComponent } from './unilevel-structure/unilevel-structure.component';
import { UserSharedModule } from '../../user-shared/user-shared.module';


@NgModule({
  declarations: [
    DirectReferralsComponent,
    BinaryTreeComponent,
    UnilevelStructureComponent
  ],
  imports: [
    CommonModule,
    UserSharedModule,
    NetworkRoutingModule
  ]
})
export class NetworkModule { }
