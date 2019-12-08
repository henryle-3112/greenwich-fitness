import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ShareMusicService, ShareSingleExerciseService, ShareTrainingService, ShareUserProfileService } from '@gw-services/shared';
import { Router } from '@angular/router';
import { Coffeti, Music, NewFeed, ResponseMessage, SingleExercise, Training, UserAchievement, UserProfile } from '@gw-models';
import { Config } from '@gw-config';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { MusicService, NewFeedService, TrainingService, UploadImageService, UserAchievementService } from '@gw-services/api';
import { Observable, Observer } from 'rxjs';
import { ImageValidator } from '@gw-services/validate';
import Plyr from 'plyr';

@Component({
  selector: 'app-single-exercise-training',
  templateUrl: './single-exercise-training.component.html',
  styleUrls: ['./single-exercise-training.component.css']
})
export class SingleExerciseTrainingComponent implements OnInit, OnDestroy, AfterViewInit {
  selectedSingleExercise: SingleExercise;
  isCountDownScreenShown: boolean;
  currentCountDownSeconds: number;
  backgroundImage: string;
  currentExerciseTime: string;
  currentSecondsExerciseTime: number;
  currentRepetitions: string;
  calculateStartExerciseTimeInterval: any;
  selectedUserProfile: UserProfile;
  isLoadingSpinnerShown: boolean;
  selectedMusic: Music;
  musics: Music[];
  musicPlayer: any;
  // import plyr to customize audio interface
  musicPlyr: any;
  isMusicModalShown: boolean;
  currentMusicsPage = 1;
  musicTitleKeywords: string;
  nMusicPerPage: number;
  totalMusic: number;
  musicsTemp: Music[];
  musicsPerPage: Music[];
  isStatusModalShown: boolean;
  userStatus: string;
  saveStatusImageUrl: string;
  statusImageUrl: string;
  isUploadImageLoading: boolean;
  coffetiAnimationInterval: any;
  nRepsUserDid: number;
  nMaxReps: number;
  trainingLog: string;
  isLogModalShown: boolean;
  currentUserHeathAfterFinished: number;
  selectedTraining: Training;
  @ViewChild('audioOption') audioPlayerRef: ElementRef;
  @ViewChild('audioContainer') audioContainerRef: ElementRef;
  audioContainerNativeElement: any;

  /**
   *
   * @param shareSingleExercise - inject shareSingleExercise
   * @param router - inject router
   * @param modal - inject modal
   * @param shareUserProfileService - inject shareUserProfileService
   * @param userAchievementService - inject userAchievementService
   * @param shareMusicService - inject shareMusicService
   * @param trainingService - inject trainingService
   * @param uploadImageService - inject uploadImageService
   * @param notification - inject notification
   * @param newFeedService - inject newFeedService
   * @param shareTrainingService - inject shareTrainingService
   * @param musicService - inject musicService
   */
  constructor(private shareSingleExercise: ShareSingleExerciseService,
    private router: Router,
    private modal: NzModalService,
    private shareUserProfileService: ShareUserProfileService,
    private userAchievementService: UserAchievementService,
    private shareMusicService: ShareMusicService,
    private trainingService: TrainingService,
    private uploadImageService: UploadImageService,
    private notification: NzNotificationService,
    private newFeedService: NewFeedService,
    private shareTrainingService: ShareTrainingService,
    private musicService: MusicService) {

  }

  /**
   * init data
   */
  ngOnInit(): void {
    this.initMusicPlyr();
    this.nRepsUserDid = 1;
    this.trainingLog = '';
    this.currentUserHeathAfterFinished = 10;
    this.nMusicPerPage = 4;
    this.musicTitleKeywords = '';
    this.getSelectedSingleExercise();
    this.getSelectedTraining();
    this.getMusics();
    this.getSelectedUserProfile();
    this.initData();
    if (this.isCountDownScreenShown) {
      this.countDownToTraining();
    } else {
      this.startExercise();
    }
  }

  /**
   * show confirm cancel exercise modal
   */
  public openConfirmCancelExerciseModal(): void {
    this.modal.confirm({
      nzTitle: '<i>Giving up is not an option!</i>',
      nzContent: '<b>Do you really want to cancel exercise?</b>',
      nzOnOk: () => {
        this.cancelExercise();
      },
      nzOnCancel: () => {
      }
    });
  }

  /**
   * go to exericse video
   */
  public goToExerciseVideo(): void {
    this.saveSingleExerciseState();
    this.router.navigate([`/client/exercise/tutorial/${this.selectedSingleExercise.slug}`]);
  }

  /**
   * open confirm finish exercise modal
   */
  public openConfirmFinishExerciseModal(): void {
    this.modal.confirm({
      nzTitle: '<i>Finish Exercise!</i>',
      nzContent: '<b>Do you finish your exercise?</b>',
      nzOnOk: () => {
        this.removeSingleExerciseState();
        clearInterval(this.calculateStartExerciseTimeInterval);
        this.isLogModalShown = true;
      },
      nzOnCancel: () => {
      }
    });
  }

  /**
   * funciton will be called when single exercise training is destroyed
   */
  ngOnDestroy(): void {
    const isAudioUndefined = typeof this.musicPlayer === 'undefined';
    if (!isAudioUndefined) {
      this.musicPlayer.pause();
      const currentSongPosition = this.musicPlayer.currentTime;
      localStorage.setItem(Config.currentSongPosition, currentSongPosition);
    }
  }

  /**
   * show music list
   */
  public openMusicListModal(): void {
    this.isMusicModalShown = true;
  }

  /**
   *
   * @param music - selected music
   */
  public changeSong(music: Music): void {
    localStorage.setItem(Config.currentSongPosition, '0');
    this.shareMusicService.changeMusic(music);
  }

  /**
   * handle cancel music list modal
   */
  public handleCancelMusicListModal(): void {
    this.isMusicModalShown = false;
  }

  /**
   * handle confirm music list modal
   */
  public handleConfirmMusicListModal(): void {
    this.isMusicModalShown = false;
  }

  /**
   *
   * @param keyword - keyword to search data
   */
  public searchMusic(keyword): void {
    this.currentMusicsPage = 1;
    this.musicTitleKeywords = keyword;
    this.isLoadingSpinnerShown = true;
    this.reloadMusicsTemp();
    this.getMusicsByPage();
  }

  /**
   *
   * @param event - selected page
   */
  public musicPageChange(event): void {
    this.currentMusicsPage = event;
    this.isLoadingSpinnerShown = true;
    this.reloadMusicsTemp();
    this.getMusicsByPage();
  }

  /**
   * handle event cancel status modal
   */
  public handleCancelStatusModal(): void {
    this.isStatusModalShown = false;
    this.openCongratulationModal();
  }

  /**
   * handle submit status modal
   */
  public handleSubmitStatusModal(): void {
    this.isStatusModalShown = false;
    const newFeed = new NewFeed();
    newFeed.image = this.saveStatusImageUrl;
    newFeed.achievement = this.currentRepetitions + ' x ' + this.selectedSingleExercise.title;
    newFeed.achievementTime = this.currentExerciseTime;
    newFeed.content = this.userStatus;
    newFeed.createdDate = new Date();
    newFeed.status = 1;
    newFeed.userProfile = this.selectedUserProfile;
    this.addUserStatusToServer(newFeed);
  }

  /**
   *
   * @param file - file to upload to server
   */
  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.createNotification('error', 'Error', 'You just can upload JPG file');
        observer.complete();
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.createNotification('error', 'Error', 'Your image size must be smaller than 2MB');
        observer.complete();
        return;
      }
      if (isJPG && isLt2M) {
        this.uploadStatusImage(file);
      }
    });
  }

  /**
   *
   * @param type - type of notification
   * @param title - title of notification
   * @param content - content of notification
   */
  createNotification(type: string, title: string, content: string): void {
    this.notification.create(
      type,
      title,
      content
    );
  }

  /**
   * handle submit log modal
   */
  public handleSubmitLogModal(): void {
    this.validateLogInformation();
  }

  /**
   * handle cancel log modal
   */
  public handleCancelLogModal(): void {
    this.validateLogInformation();
  }

  /**
   * ng after view init
   */
  ngAfterViewInit(): void {
    this.musicPlayer = this.audioPlayerRef.nativeElement;
    this.audioContainerNativeElement = this.audioContainerRef.nativeElement;
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
   * get selected single exericse
   */
  private getSelectedSingleExercise(): void {
    this.shareSingleExercise
      .currentSingleExercise.subscribe(selectedSingleExercise => {
        if (selectedSingleExercise) {
          this.selectedSingleExercise = selectedSingleExercise;
        } else {
          this.router.navigate(['/client/exercise']);
        }
      });
  }

  /**
   * get selected training
   */
  private getSelectedTraining(): void {
    this.isLoadingSpinnerShown = true;
    this.shareTrainingService.currentTraining
      .subscribe((selectedTraining: Training) => {
        if (selectedTraining) {
          this.selectedTraining = selectedTraining;
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get selected music
   */
  private getSelectedMusic(): void {
    const that = this;
    this.shareMusicService.currentMusic
      .subscribe(selectedMusic => {
        console.log(`Single Exercise Training - Music was changed`);
        this.selectedMusic = selectedMusic;
        if (this.selectedMusic) {
          if (that.musicPlayer && localStorage.getItem(Config.placeToPlayMusic).localeCompare('training') === 0) {
            that.audioContainerNativeElement.style.opacity = 1;
            that.musicPlayer.onended = function () {
              that.goToNextMusic();
            };
            that.musicPlayer.src = this.selectedMusic.musicLink;
            that.musicPlayer.currentTime = localStorage.getItem(Config.currentSongPosition) ?
              localStorage.getItem(Config.currentSongPosition) : 0;
          }
        } else {
          that.audioContainerNativeElement.style.opacity = 0;
        }
      });
  }

  /**
   * go to the next song if the current song has been finished
   */
  private goToNextMusic(): void {
    // auto get the next music
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
   * get all musics
   */
  private getMusics(): void {
    const musicStatus = 1;
    const getMusicsUrl = `${Config.apiBaseUrl}/
${Config.apiMusicManagementPrefix}/
${Config.apiMusics}?
${Config.statusParameter}=${musicStatus}`;
    this.musicService.getMusics(getMusicsUrl)
      .subscribe(response => {
        this.musics = response.body;
        this.shareMusicService.changeMusicList(this.musics);
        this.musicsTemp = this.musics;
        this.totalMusic = this.musicsTemp.length;
        this.getMusicsByPage();
      });
  }

  /**
   * get selected user-account's profile
   */
  private getSelectedUserProfile(): void {
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
        } else {
          this.router.navigate(['/client/exercise']);
        }
      });
  }

  /**
   * init data
   */
  private initData(): void {
    this.getSavedSingleExerciseState();
  }

  /**
   * get saved single exercise state
   */
  private getSavedSingleExerciseState(): void {
    this.currentCountDownSeconds = 5;
    const isCountDownSingleExerciseShown = localStorage.getItem(Config.isCountDownSingleExerciseShown);
    this.isCountDownScreenShown = !(isCountDownSingleExerciseShown && isCountDownSingleExerciseShown.localeCompare('true') === 0);
    this.backgroundImage = './assets/images/rest.jpg';
    const currentSecondsExerciseTime = localStorage.getItem(Config.currentSecondExerciseTime);
    this.currentSecondsExerciseTime = currentSecondsExerciseTime ? Number(currentSecondsExerciseTime) : 0;
    const currentExerciseTime = localStorage.getItem(Config.currentExerciseTime);
    this.currentExerciseTime = currentExerciseTime ? currentExerciseTime : '';
    this.currentRepetitions = localStorage.getItem(`${Config.currentRepetitions}`);
    this.nMaxReps = Number(this.currentRepetitions);
  }

  /**
   * show count down screen
   */
  private countDownToTraining(): void {
    const countDownTimer = setInterval(() => {
      this.currentCountDownSeconds--;
      if (this.currentCountDownSeconds <= 0) {
        this.isCountDownScreenShown = false;
        clearInterval(countDownTimer);
        this.startExercise();
      }
    }, 1000);
  }

  /**
   * start exercise
   */
  private startExercise(): void {
    this.calculateStartExerciseTimeInterval = setInterval(() => {
      this.showCurrentExerciseTime();
    }, 1000);
  }

  /**
   * show current exercise time
   */
  private showCurrentExerciseTime(): void {
    this.currentSecondsExerciseTime++;
    const minute = Math.floor(this.currentSecondsExerciseTime / 60);
    const minuteStr = minute < 10 ? '0' + minute : String(minute);
    const second = this.currentSecondsExerciseTime - (minute * 60);
    const secondStr = second < 10 ? '0' + second : String(second);
    this.currentExerciseTime = minuteStr + ':' + secondStr;
  }

  /**
   * cancel exercise
   */
  private cancelExercise(): void {
    clearInterval(this.calculateStartExerciseTimeInterval);
    this.removeSingleExerciseState();
    this.router.navigate(['/client/exercise']);
  }

  /**
   * open congratulation modal
   */
  private openCongratulationModal(): void {
    this.showCoffetiAnimation();
    this.modal.success({
      nzTitle: 'Congratulation',
      nzContent: `You've finish ${this.nRepsUserDid} x ${this.selectedSingleExercise.title}`,
      nzOnCancel: () => {
        clearInterval(this.coffetiAnimationInterval);
        this.cancelExercise();
      },
      nzOnOk: () => {
        clearInterval(this.coffetiAnimationInterval);
        this.cancelExercise();
      }
    });
  }

  /**
   * show coffeti animation
   */
  private showCoffetiAnimation(): void {
    const coffeti = new Coffeti();
    this.coffetiAnimationInterval = setInterval(() => {
      coffeti.shoot();
    }, 1000);
  }

  /**
   * add to achievements
   */
  private addToAchievements(): void {
    this.isLoadingSpinnerShown = true;
    const userAchievement = new UserAchievement();
    userAchievement.time = this.currentExerciseTime;
    userAchievement.title = this.currentRepetitions + ' x ' + this.selectedSingleExercise.title;
    userAchievement.userProfile = this.selectedUserProfile;
    userAchievement.currentHealth = String(this.currentUserHeathAfterFinished);
    userAchievement.log = this.trainingLog;
    userAchievement.nreps = this.nRepsUserDid;
    const addUserAchievementUrl = `${Config.apiBaseUrl}/${Config.apiUserManagementPrefix}/${Config.apiUserAchievements}`;
    this.userAchievementService.addUserAchievement(addUserAchievementUrl, userAchievement)
      .subscribe(() => {
        // check user start exercise from coach schedule or not
        // if yes, update training status before show status modal
        if (this.selectedTraining) {
          this.updateTrainingStatus();
        } else {
          this.isStatusModalShown = true;
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * update training status
   */
  private updateTrainingStatus(): void {
    this.selectedTraining.status = this.nRepsUserDid < Number(this.currentRepetitions) ? 2 : 1;
    this.selectedTraining.currentHealth = String(this.currentUserHeathAfterFinished);
    this.selectedTraining.nreps = this.nRepsUserDid;
    this.selectedTraining.log = this.trainingLog;
    this.isLoadingSpinnerShown = true;
    const updateTrainingUrl = `${Config.apiBaseUrl}/${Config.apiTrainingManagementPrefix}/${Config.apiTrainings}`;
    this.trainingService.updateTraining(updateTrainingUrl, this.selectedTraining)
      .subscribe(() => {
        this.isLoadingSpinnerShown = false;
        this.isStatusModalShown = true;
      });
  }

  /**
   * save single exercise's state
   */
  private saveSingleExerciseState(): void {
    localStorage.setItem(Config.currentExerciseTime, this.currentExerciseTime);
    localStorage.setItem(Config.currentSecondExerciseTime, String(this.currentSecondsExerciseTime));
    localStorage.setItem(Config.isCountDownSingleExerciseShown, 'true');
  }

  /**
   * remove single exercise's state
   */
  private removeSingleExerciseState(): void {
    localStorage.removeItem(Config.currentExerciseTime);
    localStorage.removeItem(Config.currentSecondExerciseTime);
    localStorage.removeItem(Config.isCountDownSingleExerciseShown);
  }

  /**
   * get musics by current page
   */
  private getMusicsByPage(): void {
    const startIndex = ((this.currentMusicsPage - 1) * this.nMusicPerPage) + 1;
    this.musicsPerPage = this.musicsTemp.slice(startIndex - 1, startIndex + 3);
    this.isLoadingSpinnerShown = false;

  }

  /**
   * reload musics temp based on keywords and current page
   */
  private reloadMusicsTemp(): void {
    if (this.musicTitleKeywords.localeCompare('') === 0) {
      this.musicsTemp = this.musics;
    } else {
      this.musicsTemp = [];
      this.musics.map(eachMusic => {
        if (eachMusic.musicName.includes(this.musicTitleKeywords)) {
          this.musicsTemp.push(eachMusic);
        }
      });
    }
    this.totalMusic = this.musicsTemp.length;
  }

  /**
   * add user status to server
   */
  private addUserStatusToServer(newFeed: NewFeed): void {
    this.isLoadingSpinnerShown = true;
    const addNewFeedUrl = `${Config.apiBaseUrl}/${Config.apiNewFeedManagementPrefix}/${Config.apiNewFeeds}`;
    this.newFeedService.addNewFeed(addNewFeedUrl, newFeed)
      .subscribe((insertedNewFeed: NewFeed) => {
        if (insertedNewFeed) {
          this.createNotification('success', 'Success', 'Your status was uploaded successfully');
        } else {
          this.createNotification('error', 'Error', 'Failure to upload your status');
        }
        this.openCongratulationModal();
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param file - status's image that will be uploaded
   */
  private uploadStatusImage(file: File): void {
    const formData = new FormData();
    formData.append('file', file);
    const uploadRootLocation = 'status';
    const uploadFileUrl = `${Config.apiBaseUrl}/${Config.apiUploadManagementPrefix}/${Config.apiUploads}/${uploadRootLocation}`;
    this.uploadImageService.uploadFile(uploadFileUrl, formData).subscribe(
      (responseMessage: ResponseMessage) => {
        if (responseMessage.message.localeCompare('failure') !== 0) {
          this.saveStatusImageUrl = responseMessage.message;
          this.createNotification('success', 'Success', 'Your status image was uploaded successfully');
        } else if (responseMessage.message.localeCompare('failure') === 0) {
          this.createNotification('error', 'Error', 'Cannot upload your status image! Please try again!');
        }
        ImageValidator.getBase64(file, (img: string) => {
          this.isUploadImageLoading = false;
          this.statusImageUrl = img;
        });
      }
    );
  }

  /**
   * validate log information
   */
  private validateLogInformation(): void {
    const isValidTrainingLog = this.trainingLog.localeCompare('') !== 0;
    if (!isValidTrainingLog) {
      this.createNotification('error', 'Error', 'Please input your training log');
      return;
    }
    this.isLogModalShown = false;
    this.addToAchievements();
  }
}
