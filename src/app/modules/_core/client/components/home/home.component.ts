import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {Config} from '@gw-config';
import {FacebookAccount, GoogleAccount, Music, UserAccount, UserProfile} from '@gw-models';
import {AuthenticationService} from '@gw-services/authentication';
import {FacebookAccountService, GoogleAccountService, MusicService, UserAccountService} from '@gw-services/api';
import {ShareMusicService, ShareUserAccountService, ShareUserProfileService} from '@gw-services/shared';
import {LocalStorageService} from '@gw-services/localStorage';
import {Router} from '@angular/router';
import Plyr from 'plyr';

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
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  public isDropDownMenuOpened = true;
  // check login type (login by facebook, google or normal account)
  loginType: string;
  isLoadingSpinnerShown: boolean;
  selectedMusic: Music;
  musics: Music[];
  musicPlayer: any;
  // apply plyr library to custom audio interface
  musicPlyr: any;
  selectedUserProfile: UserProfile;
  @ViewChild('audioOption') audioPlayerRef: ElementRef;
  @ViewChild('audioContainer') audioContainerRef: ElementRef;
  @ViewChild('mainContent') mainContentRef: ElementRef;
  audioContainerNativeElement: any;
  mainContentNativeElement: any;
  private browserInnerWidth: any;

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
    this.isDropDownMenuOpened = false;
    // apply Plyr to custom audio interface
    this.initMusicPlyr();
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
   *
   * @param event - event
   */
  openDropDownMenu(event): void {
    this.isDropDownMenuOpened = !this.isDropDownMenuOpened;
    if (this.isDropDownMenuOpened) {
      this.mainContentNativeElement.style.marginTop = '24px';
    } else {
      this.mainContentNativeElement.style.marginTop = '88px';
    }
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

  public goToComponent(selectedComponent: string) {
    switch (selectedComponent) {
      case 'feed':
        this.router.navigate(['/client/feed']);
        break;
      case 'profile':
        this.router.navigate(['/client/profile']);
        break;
      case 'exercises':
        this.router.navigate(['/client/exercise']);
        break;
      case 'workouts':
        this.router.navigate(['/client/workout']);
        break;
      case 'coach':
        this.router.navigate(['/client/coach']);
        break;
      case 'blog':
        this.router.navigate(['/blog/home']);
        break;
      case 'shop':
        this.router.navigate(['/shop/home']);
        break;
      case 'music':
        this.router.navigate(['/client/music']);
        break;
      case 'gallery':
        this.router.navigate(['/client/gallery']);
        break;
      case 'gift':
        this.router.navigate(['/client/gift']);
        break;
      case 'chat-bot':
        this.router.navigate(['/client/chat-bot']);
        break;
      default:
        break;
    }
    this.isDropDownMenuOpened = false;
    if (this.isDropDownMenuOpened) {
      this.mainContentNativeElement.style.marginTop = '24px';
    } else {
      this.mainContentNativeElement.style.marginTop = '88px';
    }
  }

  /**
   * ng after view init
   */
  ngAfterViewInit(): void {
    this.audioContainerNativeElement = this.audioContainerRef.nativeElement;
    this.musicPlayer = this.audioPlayerRef.nativeElement;
    this.mainContentNativeElement = this.mainContentRef.nativeElement;
    this.getSelectedMusic();
  }

  /**
   * apply plyr to customize audio interface
   */
  private initMusicPlyr() {
    this.musicPlyr = new Plyr('#audio1', {
      controls: [
        'restart',
        'play',
        'progress',
        'current-time',
        'duration',
        'mute',
        'volume',
      ]
    });
  }

  /**
   * get selected music
   */
  private getSelectedMusic(): void {
    const that = this;
    this.shareMusicService.currentMusic
      .subscribe(selectedMusic => {
        if (selectedMusic) {
          this.selectedMusic = selectedMusic;
          if (this.selectedMusic) {
            if (that.musicPlayer) {
              that.audioContainerNativeElement.style.opacity = 1;
              that.musicPlayer.onended = function () {
                that.goToNextMusic();
              };
              that.musicPlayer.src = this.selectedMusic.musicLink;
              that.musicPlayer.currentTime = localStorage.getItem(Config.currentSongPosition) ?
                localStorage.getItem(Config.currentSongPosition) : 0;
            }
          }
        } else {
          that.audioContainerNativeElement.style.opacity = 0;
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
}
