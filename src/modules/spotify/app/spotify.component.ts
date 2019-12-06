import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  playAction$: Subscription;

  selectedPlaylist: string;
  playing_uri: string;
  show_key_entry = false; // Shows developer keys at bottom of html

  player_progress_ms = 0;
  player_progress_percent = 0;
  playerInterval: any;

  constructor(
    private cacheService: CacheService,
    private spotifyService: SpotifyService
  ) { }

  ngOnInit() {

    this.spotifyInfo.playlist$ = this.spotifyService.getSysCall('playlist');
    this.spotifyInfo.songs$ = this.spotifyService.getSysCall('songs');
    this.spotifyInfo.player$ = this.spotifyService.getSysCall('player');
    
    this.spotifyService.getSysCall('player').subscribe((data: any) => {
      if (data === null) { return; }
      this.player_progress_ms = data.progress_ms;
      try { clearInterval(this.playerInterval); } catch (e) { }
      const curPlaying = data;

      if (data.is_playing) {
        curPlaying.play_started = new Date().getTime() - data.progress_ms;
        this.playerInterval = setInterval(() => {
          this.player_progress_ms = (new Date().getTime()) - curPlaying.play_started;
          if (this.player_progress_ms >= curPlaying.item.duration_ms) {
            this.player_progress_ms = curPlaying.item.duration_ms;
            try { clearInterval(this.playerInterval); } catch (e) { }
            // setTimeout(() => this.spotifyService.refreshSysCall('player', true), 500);
          } else {
            this.player_progress_percent = (this.player_progress_ms / curPlaying.item.duration_ms) * 100;
          }
        }, 250);
      }
    });
    this.apiDevice$ = this.cacheService.apiDevice$.subscribe(() => this.refresh());
  }

  ngOnDestroy() {
    try { this.apiDevice$.unsubscribe(); } catch(e) { }
    try { this.saveDevKeys$.unsubscribe(); } catch(e) { }
    try { this.playContext$.unsubscribe(); } catch(e) { }
    try { this.playTrack$.unsubscribe(); } catch(e) { }
  }

  saveDevKeys(client_id: string, client_secret: string) {
    try { this.saveDevKeys$.unsubscribe(); } catch (e) { }
    this.saveDevKeys$ = this.spotifyService.saveDevKeys(client_id, client_secret).
    subscribe(data => {
      console.log('Dev Keys Saved', data);
    });
  }

  refresh() {
    this.spotifyService.refreshSysCall('playlist');
    this.spotifyService.refreshSysCall('player');
  }

  PlayPlaylist(item: any) {
    this.selectedPlaylist = item;
    this.playing_uri = item.uri;

    try { this.playContext$.unsubscribe(); } catch (e) { }
    this.playContext$ = this.spotifyService.playcontext(item.uri, 'e9029b3eeccf4530a36b58286b7741b022c6a783').
    subscribe(data => {
      // this.spotifyService.refreshSysCall('player', true);
    });
    this.ViewPlaylist(item);
  }

  ViewPlaylist(item: any) {
    this.selectedPlaylist = item.uri;    
    this.spotifyService.changeSongList(item.id);
  }

  PlayTrack(track) {
    this.playing_uri = track.uri;
    try { this.playTrack$.unsubscribe(); } catch (e) { }
    this.playTrack$ = this.spotifyService.playuri(track.uri, 'e9029b3eeccf4530a36b58286b7741b022c6a783').
    subscribe(data => {
      // this.spotifyService.refreshSysCall('player', true);
    });
  }

  movePlayer(ms) {
    if (ms === this.player_progress_ms) { return; }
    try { clearInterval(this.playerInterval); } catch (e) { }
    try { this.playAction$.unsubscribe(); } catch (e) { }

    this.playAction$ = this.spotifyService.playerAction('seek', { 
        device_id: 'e9029b3eeccf4530a36b58286b7741b022c6a783',
        position_ms: ms
    }).
    subscribe(data => {
      // setTimeout(() => this.spotifyService.refreshSysCall('player', true), 500);
    }, err => {
      console.log('Player Action Error:', err)
    });
  }

  player(action) {
    try { this.playAction$.unsubscribe(); } catch (e) { }
    
    this.playAction$ = this.spotifyService.playerAction(action, { device_id: 'e9029b3eeccf4530a36b58286b7741b022c6a783' }).
    subscribe(data => {
      // this.spotifyService.refreshSysCall('player', true);
    }, err => {
      console.log('Player Action Error:', err)
    });
  }

}
