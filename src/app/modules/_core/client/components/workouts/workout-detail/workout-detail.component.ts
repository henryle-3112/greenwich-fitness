import {Component, OnInit} from '@angular/core';
import {DetailedRounds, Workout, WorkoutExercise} from '@gw-models';
import {ShareSingleExerciseService, ShareWorkoutService} from '@gw-services/shared';
import {Router} from '@angular/router';
import {Config} from '@gw-config';

@Component({
  selector: 'app-workout-detail',
  templateUrl: './workout-detail.component.html',
  styleUrls: ['./workout-detail.component.css']
})
export class WorkoutDetailComponent implements OnInit {
  selectedWorkout: Workout;
  isLoadingSpinnerShown: boolean;
  exercises: WorkoutExercise[];
  isChangeVolumeModelShow = false;
  radioVolumeValue: string;
  currentVolume: string;
  nDetailedRounds: number;
  detailedRounds: DetailedRounds[];
  nDetailedRoundsTemp: number;

  /**
   *
   * @param shareWorkout - inject shareWorkout
   * @param shareSingleExercise - inject shareSingleExercise
   * @param router - inject router
   */
  constructor(private shareWorkout: ShareWorkoutService,
              private shareSingleExercise: ShareSingleExerciseService,
              private router: Router) {
  }

  /**
   * init data
   */
  ngOnInit(): void {
    this.initData();
    this.getSelectedWorkout();
  }

  /**
   *
   * @param selectedSingleExercie - pass selected single exercise to view tutorial
   */
  public goToExerciseVideo(selectedSingleExercie): void {
    localStorage.setItem(Config.checkUserGoToExerciseVideo, 'true');
    this.shareSingleExercise.changeSingleExercise(selectedSingleExercie);
    this.router.navigate([`/client/exercise/tutorial/${selectedSingleExercie.slug}`]);
  }

  /**
   * go to workout training componnet
   */
  public startTraining(): void {
    localStorage.setItem(Config.placeToPlayMusic, 'training');
    this.router.navigate([`/client/workout/training/${this.selectedWorkout.slug}`]);
  }

  /**
   * handle event when user-account clicked on 'cancel' button on change volume modal
   */
  public handleCancelChangeVolumeModal(): void {
    this.isChangeVolumeModelShow = false;
  }

  /**
   * handle event when user-account clicked on 'ok' button on change volume modal
   */
  public handleConfirmChangeVolumeModal(): void {
    this.isChangeVolumeModelShow = false;
    this.currentVolume = this.radioVolumeValue;
    this.radioVolumeValue = this.currentVolume;
    this.setDetailedRounds();
    localStorage.setItem(`${Config.currentWorkoutVolume}`, this.currentVolume);
  }

  /**
   * open change volume modal
   */
  public openModalChangeVolume(): void {
    this.isChangeVolumeModelShow = true;
  }

  /**
   * init data
   */
  private initData(): void {
    this.exercises = [];
    // get saved instance state, when user go to video component and comeback
    const isUserViewedTutorVideo = localStorage.getItem(Config.checkUserGoToExerciseVideo)
      && localStorage.getItem(Config.checkUserGoToExerciseVideo).localeCompare('true') === 0;
    if (isUserViewedTutorVideo) {
      this.currentVolume = localStorage.getItem(Config.currentWorkoutVolume);
      this.radioVolumeValue = this.currentVolume;
      this.detailedRounds = [];
      localStorage.setItem(Config.checkUserGoToExerciseVideo, 'false');
    } else {
      this.currentVolume = 'x1';
      this.radioVolumeValue = this.currentVolume;
      this.detailedRounds = [];
      localStorage.setItem(`${Config.currentWorkoutVolume}`, this.currentVolume);
    }
  }

  /**
   * get selected workout
   */
  private getSelectedWorkout(): void {
    this.isLoadingSpinnerShown = true;
    this.shareWorkout
      .currentWorkout.subscribe(selectedWorkout => {
      if (selectedWorkout) {
        this.selectedWorkout = selectedWorkout;
        this.exercises = this.selectedWorkout.detailedRounds[0].exercises;
        this.setDetailedRounds();
      } else {
        this.router.navigate(['/client/workout']);
      }
      this.isLoadingSpinnerShown = false;
    });
  }

  /**
   * increase detail rounds based on volume
   */
  private setDetailedRounds(): void {
    switch (this.currentVolume) {
      case 'x1':
        this.setOneWorkout();
        break;
      case 'x2':
        this.doubleWorkouts();
        break;
      case 'x3':
        this.tripleWorkouts();
        break;
      default:
        break;
    }
  }

  /**
   * set to workout (it means that volume is 1)
   */
  private setOneWorkout(): void {
    this.nDetailedRounds = this.selectedWorkout.detailedRounds.length;
    this.detailedRounds = [];
    this.detailedRounds = this.detailedRounds.concat(this.selectedWorkout.detailedRounds);
    this.nDetailedRoundsTemp = this.nDetailedRounds;
  }

  /**
   * double workouts
   */
  private doubleWorkouts(): void {
    this.nDetailedRounds = this.selectedWorkout.detailedRounds.length;
    this.detailedRounds = [];
    let i = 0;
    while (i < 2) {
      this.detailedRounds = this.detailedRounds.concat(this.selectedWorkout.detailedRounds);
      i++;
    }
    this.nDetailedRoundsTemp = this.nDetailedRounds * 2;
  }

  /**
   * triple workouts
   */
  private tripleWorkouts(): void {
    this.nDetailedRounds = this.selectedWorkout.detailedRounds.length;
    this.detailedRounds = [];
    let j = 0;
    while (j < 3) {
      this.detailedRounds = this.detailedRounds.concat(this.selectedWorkout.detailedRounds);
      j++;
    }
    this.nDetailedRoundsTemp = this.nDetailedRounds * 3;
  }
}
