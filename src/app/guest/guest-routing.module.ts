import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductService } from '../data/services/guest/product.service';
import { AboutComponent } from './pages/about/about.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { GetQuoteComponent } from './pages/get-quote/get-quote.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProductSingleComponent } from './pages/product-single/product-single.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { RegisterComponent } from './pages/register/register.component';
import { RequestQuoteComponent } from './pages/request-quote/request-quote.component';
import { ServiceSingleComponent } from './pages/service-single/service-single.component';
import { ServicesComponent } from './pages/services/services.component';
import { ShoppingCartsComponent } from './pages/shopping-carts/shopping-carts.component';
import { TestimonialsComponent } from './pages/testimonials/testimonials.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'services/:id/:title', component: ServiceSingleComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id/:title', component: ProductSingleComponent },
  { path: 'request-quote', component: RequestQuoteComponent },
  { path: 'shopping-carts', component: ShoppingCartsComponent },
  { path: 'get-quote', component: GetQuoteComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuestRoutingModule {}
