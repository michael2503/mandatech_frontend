import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { MasterWalletComponent } from './master-wallet/master-wallet.component';
import { TransactionWalletComponent } from './transaction-wallet/transaction-wallet.component';
import { TransferComponent } from './transfer/transfer.component';
import { VoucherComponent } from './voucher/voucher.component';
import { UserSharedModule } from '../../user-shared/user-shared.module';


@NgModule({
  declarations: [
    MasterWalletComponent,
    TransactionWalletComponent,
    TransferComponent,
    VoucherComponent
  ],
  imports: [
    CommonModule,
    UserSharedModule,
    WalletRoutingModule
  ]
})
export class WalletModule { }
