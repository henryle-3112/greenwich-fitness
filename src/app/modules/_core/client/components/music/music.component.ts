import {Component, OnInit} from '@angular/core';
import {Music} from '@gw-models';
import {Config} from '@gw-config';
import {MusicService} from '@gw-services/api';
import {ShareMusicService} from '@gw-services/shared';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit {
  musics: Music[];
  currentMusicsPage: number;
  isLoadingSpinnerShown = true;
  musicTitleKeywords: string;
  nMusicPerPage: number;
  totalMusic: number;

  /**
   *
   * @param musicService - inject musicService
   * @param shareMusicService - inject shareMusicService
   */
  constructor(private musicService: MusicService,
              private shareMusicService: ShareMusicService) {
  }

  /**
   * init data
   */
  ngOnInit(): void {
    this.currentMusicsPage = Config.currentPage;
    this.nMusicPerPage = Config.numberItemsPerPage;
    this.musicTitleKeywords = '';
    this.getMusics();
  }

  /**
   *
   * @param event - selected page
   */
  public musicPageChange(event): void {
    this.currentMusicsPage = event;
    this.getMusics();
  }

  /**
   *
   * @param keyword - keyword that user-account type on the search box
   */
  public searchMusic(keyword): void {
    this.musicTitleKeywords = keyword;
    this.currentMusicsPage = 1;
    this.getMusics();
  }

  /**
   *
   * @param music - music that user-account want to play
   */
  public changeSong(music: Music): void {
    localStorage.setItem(Config.currentSongPosition, '0');
    this.shareMusicService.changeMusic(music);
  }

  /**
   * get musics by current's page
   */
  private getMusics(): void {
    const musicStatus = 1;
    let getMusicsUrl = `${Config.apiBaseUrl}/
${Config.apiMusicManagementPrefix}/
${Config.apiMusics}?
${Config.statusParameter}=${musicStatus}&
${Config.pageParameter}=${this.currentMusicsPage}`;
    if (this.musicTitleKeywords.localeCompare('') !== 0) {
      getMusicsUrl += `&${Config.searchParameter}=${this.musicTitleKeywords.toLowerCase()}`;
    }
    this.isLoadingSpinnerShown = true;
    this.musicService.getMusics(getMusicsUrl)
      .subscribe(response => {
        this.musics = response.body;
        this.totalMusic = Number(response.headers.get(Config.headerXTotalCount));
        this.isLoadingSpinnerShown = false;
      });
  }

}
