import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BinaryTreeComponent } from './binary-tree/binary-tree.component';
import { DirectReferralsComponent } from './direct-referrals/direct-referrals.component';
import { UnilevelStructureComponent } from './unilevel-structure/unilevel-structure.component';

const routes: Routes = [
  { path: '', redirectTo: '/user/network/direct-referrals', pathMatch: 'full' },
  { path: 'direct-referrals', component: DirectReferralsComponent },
  { path: 'binary-tree', component: BinaryTreeComponent },
  { path: 'unilevel-structure', component: UnilevelStructureComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetworkRoutingModule {}
