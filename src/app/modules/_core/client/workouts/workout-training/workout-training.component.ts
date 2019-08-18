import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ShareWorkoutService} from '@gw-services/core/shared/workout/share-workout.service';
import {Router} from '@angular/router';
import {
  DetailedRounds,
  Music,
  NewFeed,
  ResponseMessage, Training,
  UserAchievement,
  UserProfile,
  Workout,
  WorkoutExercise
} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {ShareSingleExerciseService} from '@gw-services/core/shared/single-exercise/share-single-exercise.service';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {UserAchievementService} from '@gw-services/core/api/user/user-achievement.service';
import {ShareMusicService} from '@gw-services/core/shared/music/share-music.service';
import {MusicService} from '@gw-services/core/api/music/music.service';
import {TrainingService} from '@gw-services/core/api/training/training.service';
import {Observable, Observer} from 'rxjs';
import {ImageValidator} from '@gw-services/core/validate/image-validator';
import {NewFeedService} from '@gw-services/core/api/feed/new-feed.service';
import {UploadImageService} from '@gw-services/core/api/upload-image/upload-image.service';
import {Coffeti} from '@gw-models/core';
import {Utils} from '@gw-helpers/core';
import {ShareTrainingService} from '@gw-services/core/shared/training/share-training.service';

@Component({
  selector: 'app-workout-training',
  templateUrl: './workout-training.component.html',
  styleUrls: ['./workout-training.component.css']
})
export class WorkoutTrainingComponent implements OnInit, OnDestroy {
  selectedWorkout: Workout;
  isCountDownScreenShown: boolean;
  currentCountDownSeconds: number;
  backgroundImage: string;
  currentWorkoutTime: string;
  currentSecondsWorkoutTime: number;
  currentVolume: string;
  nDetailedRounds: number;
  detailedRounds: DetailedRounds[];
  exercises: WorkoutExercise[];
  selectedWorkoutSingleExercise: WorkoutExercise;
  currentDetailedRoundPosition: number;
  currentSingleExercisePostition: number;
  nextFinishContent: string;
  isChangeDetailedRound: boolean;
  calculateStartWorkoutTimeIntervak: any;
  selectedUserProfile: UserProfile;
  isLoadingSpinnerShown: boolean;
  selectedMusic: Music;
  musics: Music[];
  musicPlayer: any;
  isMusicModalShown: boolean;
  currentMusicsPage = 1;
  musicTitleKeywords: string;
  nMusicPerPage: number;
  totalMusic: number;
  musicsTemp: Music[];
  musicsPerPage: Music[];
  trainingName: string;
  isStatusModalShown: boolean;
  userStatus: string;
  saveStatusImageUrl: string;
  statusImageUrl: string;
  isUploadImageLoading: boolean;
  coffetiAnimationInterval: any;
  @ViewChild('audioOption') audioPlayerRef: ElementRef;
  nRepsUserDid: number;
  nMaxReps: number;
  trainingLog: string;
  isLogModalShown: boolean;
  currentHealthAfterFinished: number;
  selectedTraining: Training;

  /**
   *
   * @param shareWorkout - inject shareWorkout
   * @param shareTrainingService - inject shareTrainingService
   * @param router - inject router
   * @param modal - inject modal
   * @param shareSingleExercise - inject shareSingleExercise
   * @param shareUserProfileService - inject shareUserProfileService
   * @param userAchievementService - inject userAchievementService
   * @param shareMusicService - inject shareMusicService
   * @param trainingService - inject trainingService
   * @param newFeedService - inject newFeedService
   * @param uploadImageService - inject uploadImageService
   * @param notification - inject notification
   * @param musicService - inject musicService
   */
  constructor(private shareWorkout: ShareWorkoutService,
              private shareTrainingService: ShareTrainingService,
              private router: Router,
              private modal: NzModalService,
              private shareSingleExercise: ShareSingleExerciseService,
              private shareUserProfileService: ShareUserProfileService,
              private userAchievementService: UserAchievementService,
              private shareMusicService: ShareMusicService,
              private trainingService: TrainingService,
              private newFeedService: NewFeedService,
              private uploadImageService: UploadImageService,
              private notification: NzNotificationService,
              private musicService: MusicService) {
  }

  /**
   * init data
   */
  ngOnInit(): void {
    this.trainingLog = '';
    this.currentHealthAfterFinished = 10;
    this.nMusicPerPage = 4;
    this.musicTitleKeywords = '';
    this.getSelectedMusic();
    this.getAllMusics();
    this.initData();
    this.getSelectedWorkout();
    this.getSelectedTraining();
    if (this.isCountDownScreenShown) {
      this.countDownToTraining();
    } else {
      this.startTraining();
    }
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
          that.musicPlayer = <HTMLAudioElement>document.getElementById('music-player');
          if (that.musicPlayer) {
            that.musicPlayer.onended = function () {
              that.goToNextMusic();
            };
            that.musicPlayer.currentTime = localStorage.getItem(Config.currentSongPosition) ?
              localStorage.getItem(Config.currentSongPosition) : 0;
          }
        }
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
        this.musicsTemp = this.musics;
        this.totalMusic = this.musicsTemp.length;
        this.getMusics();
      });
  }

  /**
   * init data
   */
  private initData(): void {
    this.getSelectedUserProfile();
    this.getSavedWorkoutState();
  }

  /**
   * get saved workout state
   */
  private getSavedWorkoutState(): void {
    this.currentCountDownSeconds = 5;
    const isCountDownSingleExerciseShown = localStorage.getItem(Config.isCountDownShown);
    this.isCountDownScreenShown = !(isCountDownSingleExerciseShown && isCountDownSingleExerciseShown.localeCompare('true') === 0);
    this.backgroundImage = './assets/images/rest.jpg';
    const currentSecondWorkoutTime = localStorage.getItem(Config.currentSecondWorkoutTime);
    this.currentSecondsWorkoutTime = currentSecondWorkoutTime ? Number(currentSecondWorkoutTime) : 0;
    const currentWorkoutTime = localStorage.getItem(Config.currentWorkoutTime);
    this.currentWorkoutTime = currentWorkoutTime ? currentWorkoutTime : '';
    this.currentVolume = localStorage.getItem(`${Config.currentWorkoutVolume}`);
    this.nMaxReps = Number(this.currentVolume.substring(1));
  }

  /**
   * get selected workout
   */
  private getSelectedWorkout(): void {
    this.shareWorkout
      .currentWorkout.subscribe(selectedWorkout => {
      if (selectedWorkout) {
        this.selectedWorkout = selectedWorkout;
        this.initFirstDetailedRound();
      } else {
        this.router.navigate(['/client/workout']);
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
   * init first detailed round
   */
  private initFirstDetailedRound(): void {
    this.exercises = this.selectedWorkout.detailedRounds[0].exercises;
    this.detailedRounds = [];
    this.calculateDetailedRounds();
    const currentDetailedRoundPosition = localStorage.getItem(Config.currentDetailedRoundPosition);
    this.currentDetailedRoundPosition = currentDetailedRoundPosition ? Number(currentDetailedRoundPosition) : 0;
    const currentSingleExercisePosition = localStorage.getItem(Config.currentSingleExercisePosition);
    this.currentSingleExercisePostition = currentSingleExercisePosition ? Number(currentSingleExercisePosition) : 0;
    this.selectedWorkoutSingleExercise = this.selectedWorkout
      .detailedRounds[this.currentDetailedRoundPosition]
      .exercises[this.currentSingleExercisePostition];
    this.nextFinishContent = 'Next - ' +
      this.selectedWorkout
        .detailedRounds[this.currentDetailedRoundPosition]
        .exercises[this.currentSingleExercisePostition + 1]
        .quantity +
      ' x ' +
      this.selectedWorkout
        .detailedRounds[this.currentDetailedRoundPosition]
        .exercises[this.currentSingleExercisePostition + 1].exercise.title;
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
        this.startTraining();
      }
    }, 1000);
  }

  /**
   * start workout training
   */
  private startTraining(): void {
    this.calculateStartWorkoutTimeIntervak = setInterval(() => {
      this.showCurrentWorkoutTime();
    }, 1000);
  }

  /**
   * show current workout time
   */
  private showCurrentWorkoutTime(): void {
    this.currentSecondsWorkoutTime++;
    const minute = Math.floor(this.currentSecondsWorkoutTime / 60);
    const minuteStr = minute < 10 ? '0' + minute : String(minute);
    const second = this.currentSecondsWorkoutTime - (minute * 60);
    const secondStr = second < 10 ? '0' + second : String(second);
    this.currentWorkoutTime = minuteStr + ':' + secondStr;
  }

  /**
   * calculate detailed rounds based on volume
   */
  private calculateDetailedRounds(): void {
    switch (this.currentVolume) {
      case 'x1':
        this.nDetailedRounds = this.selectedWorkout.detailedRounds.length;
        this.detailedRounds = this.selectedWorkout.detailedRounds;
        break;
      case 'x2':
        this.nDetailedRounds = 2 * this.selectedWorkout.detailedRounds.length;
        this.detailedRounds = this.detailedRounds.concat(this.selectedWorkout.detailedRounds)
          .concat(this.selectedWorkout.detailedRounds);
        break;
      case 'x3':
        this.nDetailedRounds = 3 * this.selectedWorkout.detailedRounds.length;
        this.detailedRounds = this.detailedRounds.concat(this.selectedWorkout.detailedRounds)
          .concat(this.selectedWorkout.detailedRounds)
          .concat(this.selectedWorkout.detailedRounds);
        break;
      default:
        break;
    }
  }

  /**
   * next and finish workout
   */
  public nextAndFinishWorkout(): void {
    if (this.nextFinishContent.localeCompare('Finish') === 0) {
      this.openConfirmFinishExerciseModal();
    } else {
      this.nextExercise();
    }
  }

  /**
   * next exercise
   */
  private nextExercise(): void {
    if (!this.isChangeDetailedRound) {
      this.currentSingleExercisePostition++;
    }
    // if current single exercise position is greater than exercises length. go to the next detailed round
    // and reset current single exercise
    if (this.currentSingleExercisePostition + 1 >
      this.detailedRounds[this.currentDetailedRoundPosition]
        .exercises.length - 1) {
      this.selectedWorkoutSingleExercise = this.detailedRounds[this.currentDetailedRoundPosition]
        .exercises[this.currentSingleExercisePostition];
      this.isChangeDetailedRound = true;
      this.currentSingleExercisePostition = 0;
      this.currentDetailedRoundPosition++;
      // if current detailed round position is greater than detailed round's length. change to finish button
      if (this.currentDetailedRoundPosition > this.detailedRounds.length - 1) {
        this.nextFinishContent = 'Finish';
      } else {
        this.nextFinishContent = 'Next - ' +
          this.detailedRounds[this.currentDetailedRoundPosition]
            .exercises[this.currentSingleExercisePostition]
            .quantity +
          ' x ' +
          this.detailedRounds[this.currentDetailedRoundPosition]
            .exercises[this.currentSingleExercisePostition].exercise.title;
      }
    } else {
      this.selectedWorkoutSingleExercise = this.detailedRounds[this.currentDetailedRoundPosition]
        .exercises[this.currentSingleExercisePostition];
      this.nextFinishContent = 'Next - ' +
        this.detailedRounds[this.currentDetailedRoundPosition]
          .exercises[this.currentSingleExercisePostition + 1]
          .quantity +
        ' x ' +
        this.detailedRounds[this.currentDetailedRoundPosition]
          .exercises[this.currentSingleExercisePostition + 1].exercise.title;
      if (this.isChangeDetailedRound) {
        this.isChangeDetailedRound = false;
      }
    }
  }

  /**
   * handle event cancel modal
   */
  public openConfirmCancelExerciseModal(): void {
    this.modal.confirm({
      nzTitle: '<i>Giving up is not an option!</i>',
      nzContent: '<b>Do you really want to cancel exercise?</b>',
      nzOnOk: () => {
        this.cancelWorkout();
      },
      nzOnCancel: () => {
      }
    });
  }

  /**
   * cancel workout
   */
  private cancelWorkout(): void {
    clearInterval(this.calculateStartWorkoutTimeIntervak);
    this.removeWorkoutState();
    this.router.navigate(['/client/workout']);
  }

  /**
   * go to exercise video component
   */
  public goToExerciseVideo(): void {
    this.saveWorkoutState();
    this.shareSingleExercise.changeSingleExercise(this.selectedWorkoutSingleExercise.exercise);
    this.router.navigate([`/client/exercise/tutorial/${this.selectedWorkoutSingleExercise.exercise.slug}`]);
  }

  /**
   * handle event when user-account's click on 'ok' button on confirm finish modal
   */
  public openConfirmFinishExerciseModal(): void {
    this.modal.confirm({
      nzTitle: '<i>Finish Exercise!</i>',
      nzContent: '<b>Do you finish your exercise?</b>',
      nzOnOk: () => {
        this.removeWorkoutState();
        clearInterval(this.calculateStartWorkoutTimeIntervak);
        this.isLogModalShown = true;
      },
      nzOnCancel: () => {
      }
    });
  }

  /**
   * show congratulation modal
   */
  private openCongratulationModal(): void {
    this.showCoffetiAnimation();
    this.modal.success({
      nzTitle: 'Congratulation',
      nzContent: `You've finish ${this.selectedWorkout.title}`,
      nzOnCancel: () => {
        clearInterval(this.coffetiAnimationInterval);
        this.cancelWorkout();
      },
      nzOnOk: () => {
        clearInterval(this.coffetiAnimationInterval);
        this.cancelWorkout();
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
   * add user-account's achievement
   */
  private addToAchievement(): void {
    this.isLoadingSpinnerShown = true;
    const userAchievement = new UserAchievement();
    userAchievement.time = this.currentWorkoutTime;
    this.getTrainingName();
    userAchievement.title = this.trainingName;
    userAchievement.userProfile = this.selectedUserProfile;
    userAchievement.log = this.trainingLog;
    userAchievement.currentHealth = String(this.currentHealthAfterFinished);
    userAchievement.nreps = this.nRepsUserDid;
    const addUserAchievementUrl = `${Config.apiBaseUrl}/${Config.apiUserManagementPrefix}/${Config.apiUserAchievements}`;
    this.userAchievementService.addUserAchievement(addUserAchievementUrl, userAchievement)
      .subscribe(() => {
        // check user start workout from coach schedule or not
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
   * get training name
   */
  private getTrainingName(): void {
    switch (this.currentVolume) {
      case 'x1':
        this.trainingName = '1 x ' + this.selectedWorkout.title;
        break;
      case 'x2':
        this.trainingName = '2 x ' + this.selectedWorkout.title;
        break;
      case 'x3':
        this.trainingName = '3 x ' + this.selectedWorkout.title;
        break;
    }
  }

  /**
   * update training's status
   */
  private updateTrainingStatus(): void {
    this.isLoadingSpinnerShown = true;
    const currentDate = Utils.getCurrentDate();
    const training = new Training();
    training.id = null;
    training.coach = null;
    training.userProfile = this.selectedUserProfile;
    training.trainingDate = currentDate;
    training.status = 1;
    training.name = this.trainingName;
    const updateTrainingUrl = `${Config.apiBaseUrl}/${Config.apiTrainingManagementPrefix}/${Config.apiTrainings}`;
    this.trainingService.updateTraining(updateTrainingUrl, training)
      .subscribe(() => {
        this.isLoadingSpinnerShown = false;
        this.isStatusModalShown = true;
      });
  }

  /**
   * get selected user-account's profile
   */
  private getSelectedUserProfile(): void {
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        this.selectedUserProfile = selectedUserProfile;
      });
  }

  /**
   * save workout's state when user-account go to other component
   */
  private saveWorkoutState(): void {
    localStorage.setItem(Config.currentDetailedRoundPosition, String(this.currentDetailedRoundPosition));
    localStorage.setItem(Config.currentSingleExercisePosition, String(this.currentSingleExercisePostition));
    localStorage.setItem(Config.isCountDownShown, 'true');
    localStorage.setItem(Config.currentWorkoutTime, String(this.currentWorkoutTime));
    localStorage.setItem(Config.currentSecondWorkoutTime, String(this.currentSecondsWorkoutTime));
  }

  /**
   * clear workout's state when component was destroyed
   */
  private removeWorkoutState(): void {
    localStorage.removeItem(Config.currentDetailedRoundPosition);
    localStorage.removeItem(Config.currentSingleExercisePosition);
    localStorage.removeItem(Config.isCountDownShown);
    localStorage.removeItem(Config.currentWorkoutTime);
    localStorage.removeItem(Config.currentSecondWorkoutTime);
  }

  /**
   * function will be called when workout training is destroyed
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
   * get musics by current page
   */
  private getMusics(): void {
    const startIndex = ((this.currentMusicsPage - 1) * this.nMusicPerPage) + 1;
    this.musicsPerPage = this.musicsTemp.slice(startIndex - 1, startIndex + 3);
    this.isLoadingSpinnerShown = false;

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
    this.getMusics();
  }

  /**
   *
   * @param event - selected page
   */
  public musicPageChange(event): void {
    this.currentMusicsPage = event;
    this.isLoadingSpinnerShown = true;
    this.reloadMusicsTemp();
    this.getMusics();
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
    newFeed.achievement = this.trainingName;
    newFeed.achievementTime = this.currentWorkoutTime;
    newFeed.content = this.userStatus;
    newFeed.createdDate = new Date();
    newFeed.status = 1;
    newFeed.userProfile = this.selectedUserProfile;
    this.addUserStatusToServer(newFeed);
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
   * @param file - status's image that will be uploaded
   */
  private uploadStatusImage(file: File) {
    this.isUploadImageLoading = true;
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
  private handleSubmitLogModal(): void {
    this.validateLogInformation();
  }

  /**
   * handle cancel log modal
   */
  private handleCancelLogModal(): void {
    this.validateLogInformation();
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
    this.addToAchievement();
  }

}
