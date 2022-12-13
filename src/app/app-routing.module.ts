import { NgModule } from '@angular/core';
import { PreloadingStrategy, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './data/guards/auth.guard';
import { AppPreloadStrategyService } from './data/services/app-preload-strategy.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./guest/guest.module').then((m) => m.GuestModule),
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
    canLoad: [AuthGuard],
    // data: {preload: true},
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: AppPreloadStrategyService,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
