import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public cookiesEnabled: boolean = false;
  public platformSource: any;
  public isNative: boolean = false;

  constructor(
    private cookieService: CookieService,
  ) { }

  public get(key): Promise<string> {
    return new Promise(res => {
      res(this.cookieService.get(key) || localStorage.getItem(key) || sessionStorage.getItem(key) || ''); 
    });
  }

  public set(key, val, asCookie = false) {
    if (this.cookiesEnabled && asCookie) {
      this.cookieService.set(key, val, new Date(new Date().setFullYear(new Date().getFullYear() + 1)), '/', '.skydiveorbust.com', true);
    } else if (this.cookiesEnabled && this.getPersistantStorageLevel() === 'local') {
      localStorage.setItem(key, val);
    } else {
      sessionStorage.setItem(key, val);
    }
  }

  public move(key, val) {
    this.delete(key);
    this.set(key, val);
  }

  public delete(key) {
    try { this.cookieService.delete(key); } catch (err) { console.log('Error Removing Cookie', err); }
    try { localStorage.removeItem(key); } catch (err) { console.log('Error Removing Storage', err); }
    try { sessionStorage.removeItem(key); } catch (err) { console.log('Error Removing Session', err); }
  }

  public getPersistantStorageLevel(): string {
    return this.cookieService.get('storage_level') || localStorage.getItem('storage_level') || sessionStorage.getItem('storage_level') || '';
  }

  public setPersistantStorageLevel(isPersist: boolean = false) {
    // console.log('Set Persist, Cookies Enabled', this.cookiesEnabled);
    if (this.cookiesEnabled) {
      localStorage.setItem('storage_level', (isPersist) ? 'local' : 'session');
      sessionStorage.removeItem('storage_level');
    } else {
      sessionStorage.setItem('storage_level', (isPersist) ? 'local' : 'session');
      localStorage.removeItem('storage_level');
    }
  }
}
