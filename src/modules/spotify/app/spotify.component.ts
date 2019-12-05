import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CacheService } from 'app/_services/cache.service';

import { SpotifyService } from './_services/spotify.service';


@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.scss']
})
export class SpotifyComponent implements OnInit {
  spotifyInfo: any = {};
  apiDevice$: Subscription;
  saveDevKeys$: Subscription;
  playContext$: Subscription;
  playTrack$: Subscription;

  selectedPlaylist: string;
  show_key_entry = false; // Shows developer keys at bottom of html

  constructor(
    private cacheService: CacheService,
    private spotifyService: SpotifyService
  ) { }

  ngOnInit() {
    this.spotifyInfo.playlist$ = this.spotifyService.getSysCall('playlist');
    this.spotifyInfo.songs$ = this.spotifyService.getSysCall('songs');
    this.apiDevice$ = this.cacheService.apiDevice$.subscribe(() => this.refresh());
  }

  ngOnDestroy() {
    try { this.apiDevice$.unsubscribe(); } catch(e) { }
    try { this.saveDevKeys$.unsubscribe(); } catch(e) { }
    try { this.playContext$.unsubscribe(); } catch(e) { }
    try { this.playTrack$.unsubscribe(); } catch(e) { }
  }

  saveDevKeys(client_id: string, client_secret: string) {
    console.log('Saving', client_id, client_secret);
    try { this.saveDevKeys$.unsubscribe(); } catch (e) { }
    this.saveDevKeys$ = this.spotifyService.saveDevKeys(client_id, client_secret).
    subscribe(data => {
      console.log('Dev Keys Saved', data);
    });
  }

  refresh() {
    this.spotifyService.refreshSysCall('playlist');
  }

  PlayPlaylist(item: any) {
    this.selectedPlaylist = item.uri;

    try { this.playContext$.unsubscribe(); } catch (e) { }
    this.playContext$ = this.spotifyService.playcontext(item.uri, 'e9029b3eeccf4530a36b58286b7741b022c6a783').
    subscribe(data => {
      console.log('Playing List', data);
    });
  }

  ViewPlaylist(item: any) {
    this.selectedPlaylist = item.uri;    
    this.spotifyService.changeSongList(item.id);
  }

  PlayTrack(track) {
    try { this.playTrack$.unsubscribe(); } catch (e) { }
    this.playTrack$ = this.spotifyService.playuri(track.uri, 'e9029b3eeccf4530a36b58286b7741b022c6a783').
    subscribe(data => {
      console.log('Playing Track', data);
    });
  }

}
