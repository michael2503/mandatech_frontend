import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserHeaderComponent } from './components/user-header/user-header.component';
import { UserLayoutComponent } from './components/user-layout/user-layout.component';
import { UserRightSideinfoComponent } from './components/user-right-sideinfo/user-right-sideinfo.component';
import { UserSidemenuComponent } from './components/user-sidemenu/user-sidemenu.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormLayoutComponent } from './components/form-layout/form-layout.component';
import { EachPayMethodComponent } from './components/each-pay-method/each-pay-method.component';
import { TabTableViewComponent } from './components/tab-table-view/tab-table-view.component';
import { Angular4PaystackModule } from 'angular4-paystack';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { PackageLayoutComponent } from './components/package-layout/package-layout.component';
import { UserEachProdComponent } from './components/user-each-prod/user-each-prod.component';
import { UserSideCartComponent } from './components/user-side-cart/user-side-cart.component';



@NgModule({
  declarations: [
    UserSidemenuComponent,
    UserHeaderComponent,
    UserLayoutComponent,
    UserRightSideinfoComponent,
    FormLayoutComponent,
    EachPayMethodComponent,
    TabTableViewComponent,
    FileUploadComponent,
    PackageLayoutComponent,
    UserEachProdComponent,
    UserSideCartComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    Angular4PaystackModule.forRoot('')
  ],
  exports: [
    UserSidemenuComponent,
    UserHeaderComponent,
    UserLayoutComponent,
    UserRightSideinfoComponent,
    FormLayoutComponent,
    EachPayMethodComponent,
    TabTableViewComponent,
    FileUploadComponent,
    PackageLayoutComponent,
    UserEachProdComponent,
    SharedModule,
    Angular4PaystackModule
  ]
})
export class UserSharedModule { }
