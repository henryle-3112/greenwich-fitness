import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ShareSingleExerciseService} from '@gw-services/core/shared/single-exercise/share-single-exercise.service';
import {Router} from '@angular/router';
import {Music, NewFeed, ResponseMessage, SingleExercise, Training, UserAchievement, UserProfile} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {NzModalService, NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {UserAchievementService} from '@gw-services/core/api/user/user-achievement.service';
import {ShareMusicService} from '@gw-services/core/shared/music/share-music.service';
import {MusicService} from '@gw-services/core/api/music/music.service';
import {TrainingService} from '@gw-services/core/api/training/training.service';
import {UploadImageService} from '@gw-services/core/api/upload-image/upload-image.service';
import {Observable, Observer} from 'rxjs';
import {ImageValidator} from '@gw-services/core/validate/image-validator';
import {NewFeedService} from '@gw-services/core/api/feed/new-feed.service';
import {Coffeti} from '@gw-models/core';
import {ShareTrainingService} from '@gw-services/core/shared/training/share-training.service';

@Component({
  selector: 'app-single-exercise-training',
  templateUrl: './single-exercise-training.component.html',
  styleUrls: ['./single-exercise-training.component.css']
})
export class SingleExerciseTrainingComponent implements OnInit, OnDestroy {

  // selected single exercise - get from share single exercise service
  selectedSingleExercise: SingleExercise;
  // check count down screen is showing or not
  isCountDown: boolean;
  // current seconds - count down screen
  currentSeconds: number;
  // current background image - set background image
  backgroundImage: string;
  // current exercise time - converted to mm:ss
  currentExerciseTime: string;
  // current seconds while training (not converted)
  currentSecondsExerciseTime: number;
  // number repetitions
  currentRepetitions: string;

  // interval
  calculateStartExerciseTime: any;

  // current user-account's profile
  selectedUserProfile: UserProfile;

  // check loading component is showing or not
  loading: boolean;

  // get selected music
  selectedMusic: Music;

  // all musics
  musics: Music[];

  player: any;

  // check is signal go back to exercise list or not
  isGoBackToExerciseList: boolean;

  // check is signal go to exercise video
  isGoToExerciseVideo: boolean;

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

  // coffeti interval to generate coffeti animation
  coffetiInterval: any;

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

  // check user go to single exercise training from coach schedule or not
  selectedTraining: Training;

  @ViewChild('audioOption') audioPlayerRef: ElementRef;

  /**
   *
   * @param shareSingleExercise - inject share single exercise to get selected single exercise
   * @param route - inject Router for routing
   * @param modal - inject modal service to open modal
   * @param shareUserProfileService - get current user-account's profile
   * @param userAchievementService - inject userAchievementService to interact with user-account's achievement's data
   * @param shareMusicService - inject share music service to get selected music
   * @param trainingService - inject training service to update training's status
   * @param uploadImageService - inject uploadImageService
   * @param notification - inject notification
   * @param newFeedService - inject newFeedService
   * @param shareTrainingService - inject shareTrainingService
   * @param musicService - inject music service to list of musics
   */
  constructor(private shareSingleExercise: ShareSingleExerciseService,
              private route: Router,
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
  ngOnInit() {
    // init number of reps, trainig log
    this.nReps = 1;
    this.trainingLog = '';
    this.currentHealth = 10;
    // init number of musics per page
    this.nMusicPerPage = 4;
    // init current search value
    this.searchValue = '';
    // get selected training
    this.getSelectedTraining();
    // get selected music
    this.getSelectedMusic();
    // get all musics
    this.getAllMusics();
    // get selected user-account's profile
    this.getSelectedUserProfile();
    // init data
    this.initData();
    // get selected single exercise
    this.getSelectedSingleExercise();
    if (this.isCountDown) {
      // count down screen
      this.countDownToTraining();
    } else {
      this.startExercise();
    }
  }

  /**
   * get selected training
   */
  private getSelectedTraining() {
    // show loading component
    this.loading = true;
    this.shareTrainingService.currentTraining
      .subscribe((selectedTraining: Training) => {
        if (selectedTraining) {
          this.selectedTraining = selectedTraining;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * if single exercise does not existed, redirect to single exercises list to let user-account choose again
   */
  private checkSelectedSingleExerciseExistedOrNot() {
    if (this.selectedSingleExercise == null) {
      this.route.navigate(['/client/exercise']);
    }
  }

  /**
   * get selected single exericse
   */
  private getSelectedSingleExercise() {
    // call share single exercise service to get selected single exercise
    this.shareSingleExercise
      .currentSingleExercise.subscribe(selectedSingleExercise => {
      // assign selected single exericse
      this.selectedSingleExercise = selectedSingleExercise;
      // check selected single exercise existed or not
      // if selected single exercise not existed - redirect to list of single exercises
      this.checkSelectedSingleExerciseExistedOrNot();
    });
  }

  /**
   * show count down screen
   */
  private countDownToTraining() {
    // count down timer
    const countDownTimer = setInterval(() => {
      this.currentSeconds--;
      if (this.currentSeconds <= 0) {
        this.isCountDown = false;
        clearInterval(countDownTimer);
        // if count down finished, start exercise
        this.startExercise();
      }
    }, 1000);
  }

  /**
   * init data
   */
  private initData() {
    // init current seconds to count down
    this.currentSeconds = 5;
    const isCountDownSingleExerciseShown = localStorage.getItem(Config.isCountDownSingleExerciseShown);
    this.isCountDown = !(isCountDownSingleExerciseShown && isCountDownSingleExerciseShown.localeCompare('true') === 0);
    // show background count down image
    this.backgroundImage = './assets/images/rest.jpg';
    const currentSecondsExerciseTime = localStorage.getItem(Config.currentSecondExerciseTime);
    if (currentSecondsExerciseTime) {
      this.currentSecondsExerciseTime = Number(currentSecondsExerciseTime);
    } else {
      // set training time seconds to 0
      this.currentSecondsExerciseTime = 0;
    }
    const currentExerciseTime = localStorage.getItem(Config.currentExerciseTime);
    if (currentExerciseTime) {
      this.currentExerciseTime = currentExerciseTime;
    } else {
      this.currentExerciseTime = '';
    }
    // get current repetitons
    this.currentRepetitions = localStorage.getItem(`${Config.currentRepetitions}`);
    // set max reps
    this.nMaxReps = Number(this.currentRepetitions);
  }

  /**
   * start exercise
   */
  private startExercise() {
    // interval to count time
    this.calculateStartExerciseTime = setInterval(() => {
      // increase time after each seconds
      this.currentSecondsExerciseTime++;
      // convert time to mm:ss
      let minuteStr = '';
      const minute = Math.floor(this.currentSecondsExerciseTime / 60);
      if (minute < 10) {
        minuteStr = '0' + minute;
      } else {
        minuteStr = String(minute);
      }
      let secondStr = '';
      const second = this.currentSecondsExerciseTime - (minute * 60);
      if (second < 10) {
        secondStr = '0' + second;
      } else {
        secondStr = String(second);
      }
      this.currentExerciseTime = minuteStr + ':' + secondStr;
    }, 1000);
  }

  /**
   * show confirm cancel exercise modal
   */
  public openConfirmCancelExerciseModal() {
    this.modal.confirm({
      nzTitle: '<i>Giving up is not an option!</i>',
      nzContent: '<b>Do you really want to cancel exercise?</b>',
      nzOnOk: () => {
        // cancel the exercise
        this.cancelExercise();
      },
      nzOnCancel: () => {
        // console.log('Cancel');
      }
    });
  }

  /**
   * cancel exercise
   */
  private cancelExercise() {
    this.isGoBackToExerciseList = true;
    // console.log('OK');
    // clear count time
    clearInterval(this.calculateStartExerciseTime);
    // remove single exercise's state
    this.removeSingleExericseState();
    // go to exercise's list
    this.route.navigate(['/client/exercise']);
  }

  /**
   * go to exericse video
   */
  public goToExerciseVideo() {
    this.isGoToExerciseVideo = true;
    // save single exercise's state
    this.saveSingleExerciseState();
    // go to video exercises
    this.route.navigate([`/client/exercise/tutorial/${this.selectedSingleExercise.slug}`]);
  }

  /**
   * open confirm finish exercise modal
   */
  public openConfirmFinishExerciseModal() {
    this.modal.confirm({
      nzTitle: '<i>Finish Exercise!</i>',
      nzContent: '<b>Do you finish your exercise?</b>',
      nzOnOk: () => {
        // console.log('OK');
        // remove single exercise's state
        this.removeSingleExericseState();
        // stop count time
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
   * open congratulation modal
   */
  private openCongratulationModal() {
    // show coffeti animation to congrate user
    const coffeti = new Coffeti();
    // shoot coffeti after every one second
    this.coffetiInterval = setInterval(() => {
      coffeti.shoot();
    }, 1000);
    this.modal.success({
      nzTitle: 'Congratulation',
      nzContent: `You've finish ${this.nReps} x ${this.selectedSingleExercise.title}`,
      nzOnCancel: () => {
        // remove single exercise's state
        this.removeSingleExericseState();
        // clear coffeti interval
        clearInterval(this.coffetiInterval);
        // redirect to client exercise page
        this.route.navigate(['/client/exercise']);
      },
      nzOnOk: () => {
        // remove single exercise's state
        this.removeSingleExericseState();
        // clear coffeti interval
        clearInterval(this.coffetiInterval);
        // redirect to client exercise page
        this.route.navigate(['/client/exercise']);
      }
    });
  }

  /**
   * add to achievements
   */
  private addToAchievements() {
    // show loading component
    this.loading = true;
    // create user-account achievement model
    const userAchievement = new UserAchievement();
    userAchievement.time = this.currentExerciseTime;
    userAchievement.title = this.currentRepetitions + ' x ' + this.selectedSingleExercise.title;
    userAchievement.userProfile = this.selectedUserProfile;
    userAchievement.currentHealth = String(this.currentHealth);
    userAchievement.log = this.trainingLog;
    userAchievement.nreps = this.nReps;
    console.log(`Number of reps: ${this.nReps}`);
    this.userAchievementService.addUserAchievement(userAchievement)
      .subscribe(insertUserAchievement => {
        console.log(insertUserAchievement);
        // check user start exericse from coach schedule or not
        // if yes, update training status before show status modal
        if (this.selectedTraining) {
          this.updateTrainingStatus();
        } else {
          // show write status modal
          this.isStatusModalShown = true;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * update training status
   */
  private updateTrainingStatus() {
    if (this.nReps < Number(this.currentRepetitions)) {
      this.selectedTraining.status = 2;
    } else {
      this.selectedTraining.status = 1;
    }
    this.selectedTraining.currentHealth = String(this.currentHealth);
    this.selectedTraining.nreps = this.nReps;
    this.selectedTraining.log = this.trainingLog;
    // show loading component
    this.loading = true;
    this.trainingService.updateTrainingStatus(this.selectedTraining)
      .subscribe((updatedTraining: Training) => {
        console.log(updatedTraining);
        // hide loading component
        this.loading = false;
        // show write status modal
        this.isStatusModalShown = true;
      });
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
   * save single exercise's state
   */
  private saveSingleExerciseState() {
    localStorage.setItem(Config.currentExerciseTime, this.currentExerciseTime);
    localStorage.setItem(Config.currentSecondExerciseTime, String(this.currentSecondsExerciseTime));
    localStorage.setItem(Config.isCountDownSingleExerciseShown, 'true');
  }

  /**
   * remove single exercise's state
   */
  private removeSingleExericseState() {
    localStorage.removeItem(Config.currentExerciseTime);
    localStorage.removeItem(Config.currentSecondExerciseTime);
    localStorage.removeItem(Config.isCountDownSingleExerciseShown);
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
          this.player = <HTMLAudioElement>document.getElementById('music-player');
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
   * funciton will be called when single exercise training is destroyed
   */
  ngOnDestroy(): void {
    console.log(`Single Exercise Training was destroyed`);
    // check audio is undefined or not
    const isAudioUndefined = typeof this.player === 'undefined';
    if (!isAudioUndefined) {
      // pause audio
      this.player.pause();
      // get current song position
      const currentSongPosition = this.player.currentTime;
      // save current position
      console.log(`Single Exercise Training - Song Current Position: ${currentSongPosition}`);
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
   * handle confirm music list modal
   */
  public handleConfirmMusicListModal() {
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
    // close status modal
    this.isStatusModalShown = false;
    // show open congratulation modal
    this.openCongratulationModal();
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
    newFeed.achievement = this.currentRepetitions + ' x ' + this.selectedSingleExercise.title;
    newFeed.achievementTime = this.currentExerciseTime;
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
        this.openCongratulationModal();
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
    this.addToAchievements();
  }
}

