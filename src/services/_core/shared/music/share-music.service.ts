import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Music } from '@gw-models/core';

@Injectable({
  providedIn: 'root'
})
export class ShareMusicService {
  private currentMusicSubject: BehaviorSubject<Music>;
  public currentMusic: Observable<Music>;
  private currentMusicListSubject: BehaviorSubject<Music[]>;
  public currentMusicList: Observable<Music[]>;

  constructor() {
    this.currentMusicSubject = new BehaviorSubject<Music>(null);
    this.currentMusic = this.currentMusicSubject.asObservable();

    this.currentMusicListSubject = new BehaviorSubject<Music[]>(null);
    this.currentMusicList = this.currentMusicListSubject.asObservable();
  }

  /**
   *
   * @param music - change current music
   */
  public changeMusic(music: Music) {
    this.currentMusicSubject.next(music);
  }

  /**
   *
   * @param musics - change music list
   */
  public changeMusicList(musics: Music[]) {
    this.currentMusicListSubject.next(musics);
  }

}
