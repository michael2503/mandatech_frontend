import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoutingService {
  constructor(private router: Router) {}

  get activeRoute() {
    return this.router.url.split('/').slice(-1).pop();
  }

  get activeRoutePath() {
    return this.router.url;
  }

  replace(commands: any[], clearHistory = true) {
    if (clearHistory) {
      this.router.navigate(commands, { replaceUrl: true });
    } else {
      this.router.navigate(commands);
    }
  }

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  urlLocator(event) {
    // Do nothing if no anchor tag.
    if (event.target instanceof HTMLAnchorElement === false) {
      return;
    }

    event.preventDefault();
    if (event.target.target === '_blank') {
      window.open(event.target.href);
    } else {
      const target = <HTMLAnchorElement>event.target;
      this.replace([target.pathname], false);
    }
  }
}
