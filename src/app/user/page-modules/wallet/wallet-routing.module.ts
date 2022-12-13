import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterWalletComponent } from './master-wallet/master-wallet.component';
import { TransactionWalletComponent } from './transaction-wallet/transaction-wallet.component';
import { TransferComponent } from './transfer/transfer.component';
import { VoucherComponent } from './voucher/voucher.component';

const routes: Routes = [
  { path: 'master-wallet', component: MasterWalletComponent },
  { path: 'transaction-wallet', component: TransactionWalletComponent },
  { path: 'transfer', component: TransferComponent },
  { path: 'voucher', component: VoucherComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletRoutingModule {}
