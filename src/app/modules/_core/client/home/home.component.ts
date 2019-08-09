import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {Config} from '@gw-config/core';
import {FacebookAccount, GoogleAccount, Music, UserAccount, UserProfile} from '@gw-models/core';
import {AuthenticationService} from '@gw-services/core/authentication/authentication.service';
import {UserAccountService} from '@gw-services/core/api/user/user-account.service';
import {FacebookAccountService} from '@gw-services/core/api/user/facebook-account.service';
import {GoogleAccountService} from '@gw-services/core/api/user/google-account.service';
import {ShareUserAccountService} from '@gw-services/core/shared/user-account/share-user-account.service';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {LocalStorageService} from '@gw-services/core/localStorage/local-storage.service';
import {ShareMusicService} from '@gw-services/core/shared/music/share-music.service';
import {MusicService} from '@gw-services/core/api/music/music.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({opacity: 0}),
        animate(200, style({opacity: 1}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate(200, style({opacity: 0}))
      ])

    ])
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  // check when width of the browser changed
  private innerWidth: any;
  // check dropdown menu is opened or not
  public isMenuOpened = true;

  // check login type (login by facebook, google or normal account)
  loginType: string;

  // check loading is showing or not
  loading: boolean;

  // selected music
  selectedMusic: Music;

  // all musics
  musics: Music[];

  player: any;

  // selected user's profile
  selectedUserProfile: UserProfile;

  @ViewChild('audioOption') audioPlayerRef: ElementRef;

  /**
   *
   * @param authentication - inject authentication service
   * @param userAccountService - inject user-account's account's service
   * @param facebookAccountService - inject facebook's account's service
   * @param googleAccountService - inject google's account's service
   * @param shareUserAccountService - inject share user-account's account's service
   * @param shareUserProfileService - inject share user-account's profile's service
   * @param localStorageService - inject local storage serivce
   * @param shareMusicService - inject share music service
   * @param musicService - inject music service
   * @param router - inject router
   */
  constructor(private authentication: AuthenticationService,
              private userAccountService: UserAccountService,
              private facebookAccountService: FacebookAccountService,
              private googleAccountService: GoogleAccountService,
              private shareUserAccountService: ShareUserAccountService,
              private shareUserProfileService: ShareUserProfileService,
              private localStorageService: LocalStorageService,
              private shareMusicService: ShareMusicService,
              private musicService: MusicService,
              private router: Router) {
  }

  /**
   * go to the next song if the current song has been finished
   */
  private goToNextMusic() {
    // auto get the next music
    let nextPosition = 0;
    for (let i = 0; i < this.musics.length; i++) {
      const currentMusic = this.musics[i];
      if (currentMusic.id === this.selectedMusic.id) {
        nextPosition = i + 1;
        break;
      }
    }
    if (nextPosition !== this.musics.length - 1) {
      this.shareMusicService.changeMusic(this.musics[nextPosition]);
    }
  }

  /**
   * init data
   */
  ngOnInit() {
    // get selected music
    this.getSelectedMusic();
    // get all musics
    this.getAllMusics();

    // clear workout's state and single exercise's state if user-account go from workout training or single exercise training
    this.localStorageService.removeWorkoutState();
    this.localStorageService.removeSingleExericseState();

    this.innerWidth = window.innerWidth;

    // get login type
    this.loginType = localStorage.getItem(Config.loginType);

    // load current user-account's information
    this.loadCurrentUserInformation();
  }

  /**
   * load current user-account's information
   */
  private loadCurrentUserInformation() {
    // show loading component
    this.loading = true;
    // check login type then load user-account's information
    if (this.loginType.localeCompare('normal') === 0) {
      this.loadNormalAccountInformation();
    } else if (this.loginType.localeCompare('facebook') === 0) {
      this.loadFacebookAccountInformation();
    } else if (this.loginType.localeCompare('google') === 0) {
      this.loadGoogleAccountInformation();
    }
  }

  /**
   * load normal account information
   */
  private loadNormalAccountInformation() {
    // get current user-account's name
    const authenticatedUserName = this.authentication.currentUserValue.userName;
    // load user-account's information by user-account's name (load user-account's account and user-account's profile)
    const getUserAccountByUsernameUrl = `${Config.api}/${Config.apiGetUserAccountByUserName}${authenticatedUserName}`;
    // get user-account's account information
    this.userAccountService.getUserAccountByUsername(getUserAccountByUsernameUrl)
      .subscribe((userAccount: UserAccount) => {
        this.shareUserAccountService.changeUserAccount(userAccount);
        this.shareUserProfileService.changeUserProfile(userAccount.userProfile);
        this.selectedUserProfile = userAccount.userProfile;
        this.loading = false;
      });
  }

  /**
   * load facebook account information
   */
  private loadFacebookAccountInformation() {
    // get facebook's id
    const selectedFacebookId = localStorage.getItem(Config.facebookId);
    // load user-account's information by facebookId
    this.facebookAccountService.getFacebookAccountByFacebookId(selectedFacebookId)
      .subscribe((facebookAccount: FacebookAccount) => {
        this.shareUserProfileService.changeUserProfile(facebookAccount.userProfile);
        this.selectedUserProfile = facebookAccount.userProfile;
        this.loading = false;
      });
  }

  /**
   * load google acccount information
   */
  private loadGoogleAccountInformation() {
    // get google's id
    const selectedGoogleId = localStorage.getItem(Config.googleId);
    // load user-account's information by googleId
    this.googleAccountService.getGoogleAccountByGoogleId(selectedGoogleId)
      .subscribe((googleAccount: GoogleAccount) => {
        this.shareUserProfileService.changeUserProfile(googleAccount.userProfile);
        this.selectedUserProfile = googleAccount.userProfile;
        this.loading = false;
      });
  }

  /**
   *
   * @param event - event
   */
  openDropDownMenu(event): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  /**
   *
   * @param event - event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.isMenuOpened = innerWidth > 801;
  }

  /**
   * get selected music
   */
  private getSelectedMusic() {
    const that = this;
    this.shareMusicService.currentMusic
      .subscribe(selectedMusic => {
        this.selectedMusic = selectedMusic;
        if (this.selectedMusic) {
          // get music player instance
          that.player = <HTMLAudioElement>document.getElementById('music-player');
          // get current song position
          // check ended event
          that.player.onended = function () {
            that.goToNextMusic();
          };
          if (localStorage.getItem(Config.currentSongPosition)) {
            that.player.currentTime = Number(localStorage.getItem(Config.currentSongPosition));
          } else {
            that.player.currentTime = 0;
          }
        }
      });
  }


  /**
   * get all musics
   */
  private getAllMusics() {
    const getAllMusicsUrl = `${Config.api}/${Config.apiGetAllMusics}`;
    this.musicService.getAllMusics(getAllMusicsUrl)
      .subscribe(musics => {
        this.musics = musics;
        this.shareMusicService.changeMusicList(musics);
      });
  }

  ngOnDestroy(): void {
    console.log(`Home component was destroyed`);
    console.log(typeof this.player);
    console.log(typeof this.player === 'undefined');
    const isAudioUndefined = typeof this.player === 'undefined';
    if (!isAudioUndefined) {
      // pause audio
      this.player.pause();
      // get current song position
      const currentSongPosition = this.player.currentTime;
      // save current position
      console.log(`Home Component - Song Current Position: ${currentSongPosition}`);
      localStorage.setItem(Config.currentSongPosition, currentSongPosition);
    }
  }

  /**
   * hanlde logout event
   */
  public logout() {
    // logout from the system
    this.authentication.logout();
    // redirect to login page
    this.router.navigate(['/login']);
  }

  /**
   * go to user's profile
   */
  public goToUserProfile() {
    this.router.navigate(['/client/profile']);
  }

  /**
   * go to notification
   */
  public goToNotification() {
    this.router.navigate(['/client/notification']);
  }
}
