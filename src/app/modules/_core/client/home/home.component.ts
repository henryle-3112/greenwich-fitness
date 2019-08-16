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
  private browserInnerWidth: any;
  public isDropDownMenuOpened = true;
  // check login type (login by facebook, google or normal account)
  loginType: string;
  isLoadingSpinnerShown: boolean;
  selectedMusic: Music;
  musics: Music[];
  musicPlayer: any;
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
   * init data
   */
  ngOnInit(): void {
    this.getSelectedMusic();
    this.getAllMusics();
    // clear workout's state and single exercise's state if
    // user-account go from workout training or single exercise training
    this.localStorageService.removeWorkoutState();
    this.localStorageService.removeSingleExericseState();
    this.browserInnerWidth = window.innerWidth;
    this.loginType = localStorage.getItem(Config.loginType);
    this.loadCurrentUserInformation();
  }

  /**
   * get selected music
   */
  private getSelectedMusic(): void {
    const that = this;
    this.shareMusicService.currentMusic
      .subscribe(selectedMusic => {
        this.selectedMusic = selectedMusic;
        if (this.selectedMusic) {
          that.musicPlayer = <HTMLAudioElement>document.getElementById('music-musicPlayer');
          if (that.musicPlayer) {
            that.musicPlayer.onended = function () {
              that.goToNextMusic();
            };
            if (localStorage.getItem(Config.currentSongPosition)) {
              that.musicPlayer.currentTime = Number(localStorage.getItem(Config.currentSongPosition));
            } else {
              that.musicPlayer.currentTime = 0;
            }
          }
        }
      });
  }

  /**
   * get all musics
   */
  private getAllMusics(): void {
    const musicStatus = 1;
    const getMusicsUrl = `${Config.apiBaseUrl}/
${Config.apiMusicManagementPrefix}/
${Config.apiMusics}?
${Config.statusParameter}=${musicStatus}`;
    this.musicService.getMusics(getMusicsUrl)
      .subscribe(response => {
        this.musics = response.body;
        this.shareMusicService.changeMusicList(this.musics);
      });
  }

  /**
   * go to the next song if the current song has been finished
   */
  private goToNextMusic(): void {
    let nextPosition = 0;
    for (let i = 0; i < this.musics.length; i++) {
      const currentMusic = this.musics[i];
      if (currentMusic.id === this.selectedMusic.id) {
        nextPosition = i + 1;
        break;
      }
    }
    if (nextPosition > this.musics.length - 1) {
      nextPosition = 0;
    }
    this.shareMusicService.changeMusic(this.musics[nextPosition]);
  }

  /**
   * load current user-account's information
   */
  private loadCurrentUserInformation(): void {
    this.isLoadingSpinnerShown = true;
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
  private loadNormalAccountInformation(): void {
    const authenticatedUserName = this.authentication.currentUserValue.userName;
    const getUserAccountUrl = `${Config.apiBaseUrl}/
${Config.apiUserManagementPrefix}/
${Config.apiUserAccounts}?
${Config.userNameParameter}=${authenticatedUserName}`;
    this.userAccountService.getUserAccount(getUserAccountUrl)
      .subscribe((userAccount: UserAccount) => {
        this.shareUserAccountService.changeUserAccount(userAccount);
        this.shareUserProfileService.changeUserProfile(userAccount.userProfile);
        this.selectedUserProfile = userAccount.userProfile;
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * load facebook account information
   */
  private loadFacebookAccountInformation(): void {
    const selectedFacebookId = localStorage.getItem(Config.facebookId);
    const getFacebookAccountUrl = `${Config.apiBaseUrl}/
${Config.apiUserManagementPrefix}/
${Config.apiFacebookAccount}/
${selectedFacebookId}`;
    this.facebookAccountService.getFacebookAccount(getFacebookAccountUrl)
      .subscribe((facebookAccount: FacebookAccount) => {
        this.shareUserProfileService.changeUserProfile(facebookAccount.userProfile);
        this.selectedUserProfile = facebookAccount.userProfile;
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * load google account information
   */
  private loadGoogleAccountInformation(): void {
    const selectedGoogleId = localStorage.getItem(Config.googleId);
    const getGoogleAccountUrl = `${Config.apiBaseUrl}/
${Config.apiUserManagementPrefix}/
${Config.apiGoogleAccount}/
${selectedGoogleId}`;
    this.googleAccountService.getGoogleAccount(getGoogleAccountUrl)
      .subscribe((googleAccount: GoogleAccount) => {
        this.shareUserProfileService.changeUserProfile(googleAccount.userProfile);
        this.selectedUserProfile = googleAccount.userProfile;
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param event - event
   */
  openDropDownMenu(event): void {
    this.isDropDownMenuOpened = !this.isDropDownMenuOpened;
  }

  /**
   *
   * @param event - event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.browserInnerWidth = window.innerWidth;
    this.isDropDownMenuOpened = this.browserInnerWidth > 801;
  }

  ngOnDestroy(): void {
    const isAudioUndefined = typeof this.musicPlayer === 'undefined';
    if (!isAudioUndefined) {
      this.musicPlayer.pause();
      const currentSongPosition = this.musicPlayer.currentTime;
      localStorage.setItem(Config.currentSongPosition, currentSongPosition);
    }
  }

  /**
   * hanlde logout event
   */
  public logout(): void {
    this.authentication.logout();
    this.router.navigate(['/login']);
  }

  /**
   * go to user's profile
   */
  public goToUserProfile(): void {
    this.router.navigate(['/client/profile']);
  }

  /**
   * go to notification
   */
  public goToNotification(): void {
    this.router.navigate(['/client/notification']);
  }
}
