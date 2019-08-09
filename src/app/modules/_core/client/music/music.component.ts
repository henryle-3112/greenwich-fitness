import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Music, ResponseMessage} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {MusicService} from '@gw-services/core/api/music/music.service';
import {ShareMusicService} from '@gw-services/core/shared/music/share-music.service';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit {

  // list of musics
  musics: Music[];

  // currentPage
  currentPage = 1;

  // loading component is show ot not
  loading = true;

  // search value - return musics and change pagination based on keywords
  searchValue: string;

  // number music per page
  nMusicPerPage: number;

  // total music
  totalMusic: number;

  /**
   *
   * @param musicService - inject music service to interact with music's data
   * @param shareMusicService - inject share music service to share seledted music to other component
   */
  constructor(private musicService: MusicService,
              private shareMusicService: ShareMusicService) {
  }

  /**
   * init data
   */
  ngOnInit() {
    // init number of musics per page
    this.nMusicPerPage = 8;
    // init current search value
    this.searchValue = '';
    // get total number of musics
    this.getNumberOfMusics();
    // get musics by page
    this.getMusicsByPage();
  }

  /**
   * get musics by current's page
   */
  private getMusicsByPage() {
    // create url to get musics by current page
    let currentGetMusicsByPageUrl = `${Config.api}/${Config.apiGetMusicsByPage}/${this.currentPage}`;
    // if search value is not equal to '', then include keywords to the url
    if (this.searchValue.localeCompare('') !== 0) {
      currentGetMusicsByPageUrl += `?keyword=${this.searchValue.toLowerCase()}`;
    }
    // show loading component
    this.loading = true;
    // get musics by page and keywords (if existed)
    this.musicService.getMusicsByPage(currentGetMusicsByPageUrl)
      .subscribe((response: Music[]) => {
        if (response) {
          this.musics = [];
          // assign data to musics
          this.musics = response;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   *
   * @param event - selected page
   */
  public musicPageChange(event) {
    // get current's page
    this.currentPage = event;
    // get musics by page
    this.getMusicsByPage();
  }

  /**
   *
   * @param keyword - keyword that user-account type on the search box
   */
  public searchMusic(keyword) {
    // set current search keyword - user-account search musics by name and change pagination based on keyword
    this.searchValue = keyword;
    // reset current page
    this.currentPage = 1;
    // change pagination
    this.getNumberOfMusics();
    this.getMusicsByPage();
  }

  /**
   * get total number of musics
   */
  private getNumberOfMusics() {
    // create url to get total number of musics
    let currentGetNumberOfMusicUrl = `${Config.api}/${Config.apiGetNumberOfMusics}`;
    // if search value is not equal to '', then include keywords to the url
    if (this.searchValue.localeCompare('') !== 0) {
      currentGetNumberOfMusicUrl += `?keyword=${this.searchValue.toLowerCase()}`;
    }
    // showing loading component
    this.loading = true;
    // get total number of musics
    this.musicService.getTotalMusics(currentGetNumberOfMusicUrl)
      .subscribe((responseMessage: ResponseMessage) => {
        if (responseMessage) {
          // assign total number of galleries to totalGallery
          this.totalMusic = Number(responseMessage.message);
        }
      });
  }

  /**
   *
   * @param music - music that user-account want to play
   */
  public changeSong(music: Music) {
    // set current position to zero when a new song has been chosen
    localStorage.setItem(Config.currentSongPosition, '0');
    this.shareMusicService.changeMusic(music);
  }

}
