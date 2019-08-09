import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ShareWorkoutService} from '@gw-services/core/shared/workout/share-workout.service';
import {Router} from '@angular/router';
import {
  DetailedRounds,
  Music,
  NewFeed,
  ResponseMessage,
  Training,
  UserAchievement,
  UserProfile,
  Workout,
  WorkoutExercise
} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {ShareSingleExerciseService} from '@gw-services/core/shared/single-exercise/share-single-exercise.service';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {UserAchievementService} from '@gw-services/core/api/user/user-achievement.service';
import {ShareMusicService} from '@gw-services/core/shared/music/share-music.service';
import {MusicService} from '@gw-services/core/api/music/music.service';
import {TrainingService} from '@gw-services/core/api/training/training.service';
import {Utils} from '@gw-helpers/core';
import {Observable, Observer} from 'rxjs';
import {ImageValidator} from '@gw-services/core/validate/image-validator';
import {NewFeedService} from '@gw-services/core/api/feed/new-feed.service';
import {UploadImageService} from '@gw-services/core/api/upload-image/upload-image.service';
import {Coffeti} from '@gw-models/core';

@Component({
  selector: 'app-workout-training',
  templateUrl: './workout-training.component.html',
  styleUrls: ['./workout-training.component.css']
})
export class WorkoutTrainingComponent implements OnInit, OnDestroy {

  // selected workout
  selectedWorkout: Workout;
  // check count down screen is open or not
  isCountDown: boolean;
  // current seconds ( count down to training )
  currentSeconds: number;
  // background rest image
  backgroundImage: string;
  // current workout time
  currentWorkoutTime: string;
  currentSecondsWorkoutTime: number;
  // current volume value
  currentVolume: string;
  // number of detailed rounds
  nDetailedRounds: number;
  // detailed rounds temp ( will be changed based on volume )
  detailedRounds: DetailedRounds[];
  // exercises list to show in what to know
  exerises: WorkoutExercise[];
  // current exercise is showing
  selectedWorkoutSingleExercise: WorkoutExercise;
  // current detailed round positiion;
  currentDetailedRoundPosition: number;
  // current exercise positiion
  currentSingleExercisePostition: number;
  // finish button's content
  nextFinishContent: string;
  // signal to tell detailed round just changed or not
  isChangeDetailedRound: boolean;
  // interval
  calculateStartExerciseTime: any;

  // selected user-account's profile
  selectedUserProfile: UserProfile;

  // check loading component is showing or not
  loading: boolean;

  // get selected music
  selectedMusic: Music;

  // all musics
  musics: Music[];

  player: any;

  // check music modal is showing or not
  isMusicModalShown: boolean;

  // currentPage
  currentPage = 1;

  // search value - return musics and change pagination based on keywords
  searchValue: string;

  // number music per page
  nMusicPerPage: number;

  // total music
  totalMusic: number;

  // need to create musics temp to load data base on current page and keywords
  musicsTemp: Music[];

  // musics per page
  musicsPerPage: Music[];

  // start index to get musics per page
  startIndex: number;

  // training's name to update training's status (e.g. 1 x Achilles)
  trainingName: string;

  // check status modal is showing or not
  isStatusModalShown: boolean;

  // user's status
  userStatus: string;

  // saved status's image url
  saveStatusImageUrl: string;

  // status image url
  statusImageUrl: string;

  // check image is upload or not;
  isUploadImage: boolean;

  // check image upload is loading or not
  isUploadImageLoading: boolean;

  // coffeti interval to show coffeti after every one second
  coffetiInterval: any;

  @ViewChild('audioOption') audioPlayerRef: ElementRef;

  // number of reps
  nReps: number;

  // number of max reps
  nMaxReps: number;

  // log training
  trainingLog: string;

  // check log modal is showing or not
  isLogModalShown: boolean;

  // user need to grade their current health after they finish the exercise
  currentHealth: number;

  /**
   *
   * @param shareWorkout - inject share workout service to get selected workout
   * @param route - inject router for routing
   * @param modal - inject modal
   * @param shareSingleExercise - inject share single exercise service to get selected single exercise
   * @param shareUserProfileService - inject share user-account's profile service to get current user-account's profile
   * @param userAchievementService - inject userAchievementService
   * @param shareMusicService - inject share music service to get selected music
   * @param trainingService - inject training's service to update training's status
   * @param newFeedService - inject new feed service
   * @param notification - inject notification service
   * @param uploadImageService - inject upload image service
   * @param musicService - inject music service to list of musics
   */
  constructor(private shareWorkout: ShareWorkoutService,
              private route: Router,
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
  ngOnInit() {
    // init number of reps, trainig log
    this.trainingLog = '';
    this.currentHealth = 10;
    // init number of musics per page
    this.nMusicPerPage = 4;
    // init current search value
    this.searchValue = '';
    // get music player instance
    this.player = <HTMLAudioElement>document.getElementById('music-player');
    // get selected music
    this.getSelectedMusic();
    // get all musics
    this.getAllMusics();
    // init data
    this.initData();
    // get selected workout
    this.getSelectedWorkout();
    // check count down is shown or not
    const isCountDownShown = localStorage.getItem(Config.isCountDownShown);
    if (isCountDownShown && isCountDownShown.localeCompare('true') === 0) {
      this.isCountDown = false;
      // start exercise immediately if the count down was shown
      this.startTraining();
    } else {
      this.isCountDown = true;
      // count down screen
      this.countDownToTraining();
    }
  }

  /**
   * init data
   */
  private initData() {
    // get selected user-account's profile
    this.getSelectedUserProfile();
    // init current seconds count down
    this.currentSeconds = 5;
    // show count down screen
    this.isCountDown = true;
    // show background image to go count down screen
    this.backgroundImage = './assets/images/rest.jpg';
    // exercise current seconds
    const currentSecondWorkoutTime = localStorage.getItem(Config.currentSecondWorkoutTime);
    if (currentSecondWorkoutTime) {
      this.currentSecondsWorkoutTime = Number(currentSecondWorkoutTime);
    } else {
      this.currentSecondsWorkoutTime = 0;
    }
    // workout time (converted)
    const currentWorkoutTime = localStorage.getItem(Config.currentWorkoutTime);
    if (currentWorkoutTime) {
      this.currentWorkoutTime = currentWorkoutTime;
    } else {
      this.currentWorkoutTime = '';
    }
    // save current volume
    this.currentVolume = localStorage.getItem(`${Config.currentWorkoutVolume}`);
    // set max reps
    this.nMaxReps = Number(this.currentVolume);
  }

  /**
   * get selected workout
   */
  private getSelectedWorkout() {
    this.shareWorkout
      .currentWorkout.subscribe(selectedWorkout => {
      // console.log(selectedWorkout);
      this.selectedWorkout = selectedWorkout;
      // check selected workout existed or not
      // if selected workout not existed - redirect to list of workouts
      this.checkSelectedWorkoutExistedOrNot();
    });
  }

  /**
   * show count down screen
   */
  private countDownToTraining() {
    const countDownTimer = setInterval(() => {
      this.currentSeconds--;
      if (this.currentSeconds <= 0) {
        this.isCountDown = false;
        clearInterval(countDownTimer);
        this.startTraining();
      }
    }, 1000);
  }

  /**
   * check selected workout existed or not, if not, redirect to workout list to let user-account choose again
   */
  private checkSelectedWorkoutExistedOrNot() {
    if (this.selectedWorkout == null) {
      this.route.navigate(['/client/workout']);
    } else {
      // console.log(`Current volume: ${this.currentVolume}`);
      this.exerises = this.selectedWorkout.detailedRounds[0].exercises;
      this.detailedRounds = [];
      this.calculateDetailedRounds();
      // console.log(this.detailedRounds);
      // init current detailed round position
      const currentDetailedRoundPosition = localStorage.getItem(Config.currentDetailedRoundPosition);
      if (currentDetailedRoundPosition) {
        this.currentDetailedRoundPosition = Number(currentDetailedRoundPosition);
      } else {
        this.currentDetailedRoundPosition = 0;
      }
      const currentSingleExercisePosition = localStorage.getItem(Config.currentSingleExercisePosition);
      if (currentSingleExercisePosition) {
        this.currentSingleExercisePostition = Number(currentSingleExercisePosition);
      } else {
        this.currentSingleExercisePostition = 0;
      }
      // get first selected exercise
      this.selectedWorkoutSingleExercise = this.selectedWorkout
        .detailedRounds[this.currentDetailedRoundPosition]
        .exercises[this.currentSingleExercisePostition];
      // init button next and finish
      this.nextFinishContent = 'Next - ' +
        this.selectedWorkout
          .detailedRounds[this.currentDetailedRoundPosition]
          .exercises[this.currentSingleExercisePostition + 1]
          .quantity +
        ' x ' +
        this.selectedWorkout
          .detailedRounds[this.currentDetailedRoundPosition]
          .exercises[this.currentSingleExercisePostition + 1].exercise.title;
      // console.log(this.selectedWorkoutSingleExercise);
    }
  }

  /**
   * start workout training
   */
  private startTraining() {
    this.calculateStartExerciseTime = setInterval(() => {
      this.currentSecondsWorkoutTime++;
      let minuteStr = '';
      const minute = Math.floor(this.currentSecondsWorkoutTime / 60);
      if (minute < 10) {
        minuteStr = '0' + minute;
      } else {
        minuteStr = String(minute);
      }
      let secondStr = '';
      const second = this.currentSecondsWorkoutTime - (minute * 60);
      if (second < 10) {
        secondStr = '0' + second;
      } else {
        secondStr = String(second);
      }
      this.currentWorkoutTime = minuteStr + ':' + secondStr;
    }, 1000);
  }

  /**
   * calculate detailed rounds based on volume
   */
  private calculateDetailedRounds() {
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
  public nextAndFinishWorkout() {
    if (this.nextFinishContent.localeCompare('Finish') === 0) {
      // if there is not any exercises. Finish button will be shown
      this.openConfirmFinishExerciseModal();
    } else {
      if (!this.isChangeDetailedRound) {
        // increase current single exercise position
        this.currentSingleExercisePostition++;
      }
      // if current single exercise position is greater than exercises length. go to the next detailed round
      // and reset current single exercise
      if (this.currentSingleExercisePostition + 1 >
        this.detailedRounds[this.currentDetailedRoundPosition]
          .exercises.length - 1) {
        // set selected workout single exercise
        this.selectedWorkoutSingleExercise = this.detailedRounds[this.currentDetailedRoundPosition]
          .exercises[this.currentSingleExercisePostition];
        // is change detail round
        this.isChangeDetailedRound = true;
        // reset current single exercise position
        this.currentSingleExercisePostition = 0;
        // increase current detailed round position
        this.currentDetailedRoundPosition++;
        // if current detailed round positiion is greater than detailed round's length. change to finish button
        if (this.currentDetailedRoundPosition > this.detailedRounds.length - 1) {
          // change to finish button
          this.nextFinishContent = 'Finish';
        } else {
          // change next content
          this.nextFinishContent = 'Next - ' +
            this.detailedRounds[this.currentDetailedRoundPosition]
              .exercises[this.currentSingleExercisePostition]
              .quantity +
            ' x ' +
            this.detailedRounds[this.currentDetailedRoundPosition]
              .exercises[this.currentSingleExercisePostition].exercise.title;
        }
      } else {
        // set selected workout single exercise
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
  }

  /**
   * handle event cancel modal
   */
  public openConfirmCancelExerciseModal() {
    this.modal.confirm({
      nzTitle: '<i>Giving up is not an option!</i>',
      nzContent: '<b>Do you really want to cancel exercise?</b>',
      nzOnOk: () => {
        // console.log('OK');
        // clear timer count
        clearInterval(this.calculateStartExerciseTime);
        // show write log modal
        this.isLogModalShown = true;
      },
      nzOnCancel: () => {
        // console.log('Cancel');
      }
    });
  }

  /**
   * cancel workout
   */
  private cancelWorkout() {
    // clear workout's state
    this.removeWorkoutState();
    // go back to workout's list
    this.route.navigate(['/client/workout']);
  }

  /**
   * go to exercise video component
   */
  public goToExerciseVideo() {
    // save current workout's state
    this.saveWorkoutState();
    // pass single exercise to video exercise component
    this.shareSingleExercise.changeSingleExercise(this.selectedWorkoutSingleExercise.exercise);
    this.route.navigate([`/client/exercise/tutorial/${this.selectedWorkoutSingleExercise.exercise.slug}`]);
  }

  /**
   * handle event when user-account's click on 'ok' button on confirm finish modal
   */
  public openConfirmFinishExerciseModal() {
    this.modal.confirm({
      nzTitle: '<i>Finish Exercise!</i>',
      nzContent: '<b>Do you finish your exercise?</b>',
      nzOnOk: () => {
        // console.log('OK');
        clearInterval(this.calculateStartExerciseTime);
        this.openCongratulationModal();
      },
      nzOnCancel: () => {
        // console.log('Cancel');
      }
    });
  }

  /**
   * show congratulation modal
   */
  private openCongratulationModal() {
    // create coffeti object
    const coffeti = new Coffeti();
    // create interval to shoot coffeti animation after every one second
    this.coffetiInterval = setInterval(() => {
      coffeti.shoot();
    }, 1000);
    this.modal.success({
      nzTitle: 'Congratulation',
      nzContent: `You've finish ${this.selectedWorkout.title}`,
      nzOnCancel: () => {
        // add to achievement
        this.addToAchievement();
      },
      nzOnOk: () => {
        // add to achievement
        this.addToAchievement();
      }
    });
  }

  /**
   * add user-account's achievement
   */
  private addToAchievement() {
    // show loading component
    this.loading = true;
    // create user-account's achievement model
    const userAchievement = new UserAchievement();
    userAchievement.time = this.currentWorkoutTime;
    // set title for userAchievement
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
    userAchievement.title = this.trainingName;
    userAchievement.userProfile = this.selectedUserProfile;
    userAchievement.log = this.trainingLog;
    userAchievement.currentHealth = String(this.currentHealth);
    userAchievement.nreps = this.nReps;

    // add to user-account's achievement
    this.userAchievementService.addUserAchievement(userAchievement)
      .subscribe(insertedUserAchievement => {
        console.log(insertedUserAchievement);
        // show write status modal
        this.isStatusModalShown = true;
        // hide loading component
        this.loading = false;
        // remove workout state
        this.removeWorkoutState();
      });
  }

  /**
   * update training's status
   */
  private updateTrainingStatus() {
    // show loading component
    /* this.loading = true;
    // get training's date
    const currentDate = Utils.getCurrentDate();
    // create training object to update training's status
    const training = new Training();
    training.id = null;
    training.coach = null;
    training.userProfile = this.selectedUserProfile;
    training.trainingDate = currentDate;
    training.status = 1;
    training.name = this.trainingName;
    this.trainingService.updateTrainingStatus(training)
      .subscribe((responseMessage: ResponseMessage) => {
        // hide loading component
        this.loading = false;
        // show write status modal
        this.isStatusModalShown = true;
      }); */
  }

  /**
   * get selected user-account's profile
   */
  private getSelectedUserProfile() {
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        this.selectedUserProfile = selectedUserProfile;
      });
  }

  /**
   * save workout's state when user-account go to other component
   */
  private saveWorkoutState() {
    localStorage.setItem(Config.currentDetailedRoundPosition, String(this.currentDetailedRoundPosition));
    localStorage.setItem(Config.currentSingleExercisePosition, String(this.currentSingleExercisePostition));
    localStorage.setItem(Config.isCountDownShown, 'true');
    localStorage.setItem(Config.currentWorkoutTime, String(this.currentWorkoutTime));
    localStorage.setItem(Config.currentSecondWorkoutTime, String(this.currentSecondsWorkoutTime));
  }

  /**
   * clear workout's state when component was destroyed
   */
  private removeWorkoutState() {
    localStorage.removeItem(Config.currentDetailedRoundPosition);
    localStorage.removeItem(Config.currentSingleExercisePosition);
    localStorage.removeItem(Config.isCountDownShown);
    localStorage.removeItem(Config.currentWorkoutTime);
    localStorage.removeItem(Config.currentSecondWorkoutTime);
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
          // check ended event
          that.player.onended = function () {
            that.goToNextMusic();
          };
          that.player.onseeked = function () {
            console.log(that.player.currentTime);
          };
          if (localStorage.getItem(Config.currentSongPosition)) {
            that.player.currentTime = localStorage.getItem(Config.currentSongPosition);
          } else {
            that.player.currentTime = 0;
          }
        }
      });
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
    // set current music
    this.shareMusicService.changeMusic(this.musics[nextPosition]);
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
        // asign all data to musicsTemp the first time
        this.musicsTemp = musics;
        // calculate total musics
        this.totalMusic = this.musicsTemp.length;
        // load musics per page
        this.getMusicsByPage();
      });
  }

  /**
   * funciton will be called when workout training is destroyed
   */
  ngOnDestroy(): void {
    // check audio is undefined or not
    const isAudioUndefined = typeof this.player === 'undefined';
    if (!isAudioUndefined) {
      // pause audio
      this.player.pause();
      // get current song position
      const currentSongPosition = this.player.currentTime;
      // save current position
      localStorage.setItem(Config.currentSongPosition, currentSongPosition);
    }
  }

  /**
   * show music list
   */
  public openMusicListModal() {
    // show music list modal
    this.isMusicModalShown = true;
  }

  /**
   *
   * @param music - selected music
   */
  public changeSong(music: Music) {
    // set current position to zero when a new song has been chosen
    localStorage.setItem(Config.currentSongPosition, '0');
    this.shareMusicService.changeMusic(music);
  }

  /**
   * handle cancel music list modal
   */
  public handleCancelMusicListModal() {
    // cancel music list modal
    this.isMusicModalShown = false;
  }

  /**
   * get musics by current page
   */
  private getMusicsByPage() {
    // init startIndex
    this.startIndex = ((this.currentPage - 1) * this.nMusicPerPage) + 1;
    // get musics data per page
    this.musicsPerPage = this.musicsTemp.slice(this.startIndex - 1, this.startIndex + 3);
    this.loading = false;

  }

  /**
   *
   * @param keyword - keyword to search data
   */
  public searchMusic(keyword) {
    // reset current page
    this.currentPage = 1;
    // change search value
    this.searchValue = keyword;
    // show loading component
    this.loading = true;
    // reload data based on keywords
    this.reloadMusicsTemp();
    // load data for new page
    this.getMusicsByPage();
  }

  /**
   *
   * @param event - selected page
   */
  public musicPageChange(event) {
    // get current's page
    this.currentPage = event;
    // show loading component
    this.loading = true;
    // reload data based on keywords
    this.reloadMusicsTemp();
    // load data for new page
    this.getMusicsByPage();
  }

  /**
   * reload musics temp based on keywords and current page
   */
  private reloadMusicsTemp() {
    // if search value is equal to '', get all single exercises
    if (this.searchValue.localeCompare('') === 0) {
      this.musicsTemp = this.musics;
    } else {
      // assign musics temp is empty
      this.musicsTemp = [];
      // push each music to musics temp based on keywords
      this.musics.map(eachMusic => {
        if (eachMusic.musicName.includes(this.searchValue)) {
          this.musicsTemp.push(eachMusic);
        }
      });
    }
    // calculate current total exercises
    this.totalMusic = this.musicsTemp.length;
  }

  /**
   * handle event cancel status modal
   */
  public handleCancelStatusModal() {
    // clear coffeti interval
    clearInterval(this.coffetiInterval);
    // close status modal
    this.isStatusModalShown = false;
    // user does not want to write staus, redirect to exercise list
    this.route.navigate(['/client']);
  }

  /**
   * handle submit status modal
   */
  public handleSubmitStatusModal() {
    // close status modal
    this.isStatusModalShown = false;
    // create new feed object
    const newFeed = new NewFeed();
    newFeed.image = this.saveStatusImageUrl;
    newFeed.achievement = this.trainingName;
    newFeed.achievementTime = this.currentWorkoutTime;
    newFeed.content = this.userStatus;
    newFeed.createdDate = new Date();
    newFeed.status = 1;
    newFeed.userProfile = this.selectedUserProfile;
    // add status to the server
    this.addUserStatusToServer(newFeed);
  }

  /**
   * add user status to server
   */
  private addUserStatusToServer(newFeed: NewFeed) {
    // show loading component
    this.loading = true;
    this.newFeedService.addNewFeed(newFeed)
      .subscribe((insertedNewFeed: NewFeed) => {
        if (insertedNewFeed) {
          this.createNotification('success', 'Success', 'Your status was uploaded successfully');
        } else {
          this.createNotification('error', 'Error', 'Failure to upload your status');
        }
        // clear coffeti interval
        clearInterval(this.coffetiInterval);
        // redirect to client exercise page
        this.route.navigate(['/client/workout']);
        // hide loading component
        this.loading = false;
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
      observer.next(isJPG && isLt2M);
    });
  };

  /**
   *
   * @param info - file info
   */
  handleChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.isUploadImageLoading = true;
        const formData = new FormData();
        formData.append('file', info.file.originFileObj);
        // if image was not uploaded
        if (!this.isUploadImage) {
          this.uploadImageService.uploadImage(formData, 'status').subscribe(
            (responseMessage: ResponseMessage) => {
              if (responseMessage.message.localeCompare('failure') !== 0) {
                // save image url that was returned from the server
                this.saveStatusImageUrl = responseMessage.message;
                // show successfull notification to users
                this.createNotification('success', 'Success', 'Your status image was uploaded successfully');
              } else if (responseMessage.message.localeCompare('failure') === 0) {
                // if the image cannot be uploaded to the server. show notification to users
                this.createNotification('error', 'Error', 'Cannot upload your status image! Please try again!');
              }
              ImageValidator.getBase64(info.file.originFileObj, (img: string) => {
                this.isUploadImageLoading = false;
                this.statusImageUrl = img;
              });
            }
          );
          this.isUploadImage = true;
        }
        break;
    }
  }

  /**
   *
   * @param type - type of notification
   * @param title - title of notification
   * @param content - content of notification
   */
  createNotification(type: string, title: string, content: string) {
    this.notification.create(
      type,
      title,
      content
    );
  }

  /**
   * handle submit log modal
   */
  private handleSubmitLogModal() {
    // validate log information
    this.validateLogInformation();
  }

  /**
   * handle cancel log modal
   */
  private handleCancelLogModal() {
    // validate log information
    this.validateLogInformation();
  }

  /**
   * validate log information
   */
  private validateLogInformation() {
    // validate training log
    const isValidTrainingLog = this.trainingLog.localeCompare('') !== 0;
    if (!isValidTrainingLog) {
      // show error message to user
      this.createNotification('error', 'Error', 'Please input your training log');
      return;
    }

    // close write log modal
    this.isLogModalShown = false;

    // add to achievements
    this.addToAchievement();
  }

}
