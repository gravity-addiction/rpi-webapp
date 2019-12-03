import { Injectable, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  @HostListener('window:resize', ['$event'])
    onResize(_event?) {
      this.screenHeight = window.innerHeight;
      this.screenWidth = window.innerWidth;
  }

  public screenHeight: number;
  public screenWidth: number;
  public settings;
  public overlay: string = '';

  public currentUrl: string;
  public previousUrl: string = '/';
  public canGoBack: boolean = false;
  public routerEvents$: Subscription;

  public apiUrl: any = {
    'local': '/api/',
    // 'pi': 'http://192.168.126.56/api/'
  }

  constructor(
    private _storage: StorageService
  ) {
    this.onResize();
    this.settings = this.defaultSettings({});
  }

  public initRouterEvents(router: Router) {
    this.currentUrl = router.url;
    // this.previousUrl = router.url;
    this.routerEvents$ = router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });    
  }

  public initSettings() {
    return this.fetchSettings().then(settings => {
      settings = this.defaultSettings(settings);
      this.settings = settings;
    }).
    then(() => Object.keys(this.settings));
  }

  public defaultSettings(settings) {
    const doc: any = document.createElement("a");
    doc.href = window.location.href;
    const hostname = doc.origin || (doc.protocol + '//' + doc.hostname);

    if (!settings) { settings = {}; }

    // Add Settings Here

    return settings;
  }

  public fetchSettings() {
    return this._storage.get('sdob419');
  }

  public saveSettings() {
    return this._storage.set('sdob419', this.settings);
  }


}

export function CacheServiceFactory(provider: CacheService) {
  return () => provider.initSettings();
}


