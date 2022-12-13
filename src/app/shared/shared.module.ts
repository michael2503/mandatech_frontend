import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BannerCarouselComponent } from './components/banner-carousel/banner-carousel.component';
import { AllowNumDirective } from './directives/allow-num.directive';
import { SafeUrlPipe } from './pipe/safe-url.pipe';
import { FlexSliderComponent } from './components/flex-slider/flex-slider.component';
import { ModalModule } from './modules/modal/modal.module';
import { LoadingBtnComponent } from './components/loading-btn/loading-btn.component';
import { CusAccordionComponent } from './components/cus-accordion/cus-accordion.component';
import { SafeHtmlPipe } from './pipe/safe-html.pipe';
import { TimeAgoPipe } from './pipe/time-ago.pipe';
import { DropdownDirective } from './directives/dropdown.directive';
import { StripHtmlPipe } from './pipe/strip-html.pipe';
import { SummaryPipe } from './pipe/summary.pipe';
import { PageLoaderComponent } from './components/page-loader/page-loader.component';
import { CopyTextDirective } from './directives/copy-text.directive';
import { TreatImgUrlPipe } from './pipe/treat-img-url.pipe';
import { GraphComponent } from './components/graph/graph.component';
import { PassToggleDirective } from './directives/pass-toggle.directive';
import { FileSizePipe } from './pipe/file-size.pipe';
import { PaginationComponent } from './components/pagination/pagination.component';
import { TextTransformPipe } from './pipe/text-transform.pipe';
import { TruncateAmountPipe } from './pipe/truncate-amount.pipe';
import { BvnDecodePipe } from './pipe/bvn-decode.pipe';
import { CleanUrlPipe } from './pipe/clean-url.pipe';
import {
    CloudinaryConfiguration,
    CloudinaryModule,
} from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { EachProductComponent } from './components/each-product/each-product.component';
import { FadeSliderComponent } from './components/fade-slider/fade-slider.component';
import { PublicIdPipe } from './pipe/public-id.pipe';
import { AltImageFormatDirective } from './directives/alt-image-format.directive';
import { RegisterStageComponent } from './components/register-stage/register-stage.component';
import { PhoneCodePipe } from './pipe/phone-code.pipe';
import { PricePipe } from './pipe/price.pipe';
import { ProdPackagePipe } from './pipe/prod-package.pipe';
import { GroupAccordionComponent } from './components/group-accordion/group-accordion.component';
import { HomeHeaderComponent } from './components/home-header/home-header.component';
import { EachTestimonyComponent } from './components/each-testimony/each-testimony.component';
// import { NgwWowModule } from 'ngx-wow';
import { UrlToStringPipe } from './pipe/url-to-string.pipe';
import { NgwWowModule } from 'ngx-wow';

@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        BannerCarouselComponent,
        AllowNumDirective,
        SafeUrlPipe,
        SafeHtmlPipe,
        FlexSliderComponent,
        LoadingBtnComponent,
        CusAccordionComponent,
        TimeAgoPipe,
        DropdownDirective,
        StripHtmlPipe,
        SummaryPipe,
        PageLoaderComponent,
        CopyTextDirective,
        TreatImgUrlPipe,
        // GraphComponent,
        PassToggleDirective,
        FileSizePipe,
        PaginationComponent,
        TextTransformPipe,
        TruncateAmountPipe,
        BvnDecodePipe,
        CleanUrlPipe,
        EachProductComponent,
        FadeSliderComponent,
        PublicIdPipe,
        AltImageFormatDirective,
        RegisterStageComponent,
        PhoneCodePipe,
        PricePipe,
        ProdPackagePipe,
        GroupAccordionComponent,
        HomeHeaderComponent,
        EachTestimonyComponent,
        UrlToStringPipe
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule,
        NgwWowModule,
        CloudinaryModule.forRoot({ Cloudinary }, {
            cloud_name: 'natures-extracts',
        } as CloudinaryConfiguration),
    ],
    exports: [
        HeaderComponent,
        FooterComponent,
        FormsModule,
        ReactiveFormsModule,
        BannerCarouselComponent,
        AllowNumDirective,
        SafeUrlPipe,
        SafeHtmlPipe,
        FlexSliderComponent,
        ModalModule,
        CloudinaryModule,
        LoadingBtnComponent,
        CusAccordionComponent,
        TimeAgoPipe,
        DropdownDirective,
        StripHtmlPipe,
        SummaryPipe,
        PageLoaderComponent,
        CopyTextDirective,
        TreatImgUrlPipe,
        // GraphComponent,
        PassToggleDirective,
        FileSizePipe,
        PaginationComponent,
        TextTransformPipe,
        TruncateAmountPipe,
        BvnDecodePipe,
        CleanUrlPipe,
        EachProductComponent,
        FadeSliderComponent,
        PublicIdPipe,
        AltImageFormatDirective,
        RegisterStageComponent,
        PhoneCodePipe,
        PricePipe,
        ProdPackagePipe,
        GroupAccordionComponent,
        HomeHeaderComponent,
        EachTestimonyComponent,
        UrlToStringPipe
    ],
})
export class SharedModule {}
