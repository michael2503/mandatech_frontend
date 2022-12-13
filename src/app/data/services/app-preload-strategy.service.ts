import { Injectable } from '@angular/core';
import {
  PreloadingStrategy,
  PRIMARY_OUTLET,
  Route,
  Router,
} from '@angular/router';
import { Observable, timer, flatMap, of } from 'rxjs';
import { AuthGuard } from '../guards/auth.guard';

@Injectable({
  providedIn: 'root',
})
export class AppPreloadStrategyService implements PreloadingStrategy {
  constructor(private guard: AuthGuard, private router: Router) {}

  preload(route: Route, fn: () => Observable<any>): Observable<any> {
    const loadRoute = (delay) =>
      delay ? timer(150).pipe(flatMap((_) => fn())) : fn();

    if (this.router.url.match(/\/user(\/.+)?$/)) {
      let gres = this.guard.canLoad(
        route,
        this.router.parseUrl(route.path).root.children[PRIMARY_OUTLET].segments
      );
    //   console.log(gres['__zone_symbol__value']);
    //   console.log(route.path);
      if (typeof gres['__zone_symbol__value'] == 'object') return of(null);
      return loadRoute(false);
    }
    return route.data && route.data['preload']
      ? loadRoute(route.data['delay'])
      : of(null);
  }
}
