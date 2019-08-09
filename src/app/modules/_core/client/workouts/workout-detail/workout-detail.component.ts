import {Component, OnInit} from '@angular/core';
import {DetailedRounds, Workout, WorkoutExercise} from '@gw-models/core';
import {ShareWorkoutService} from '@gw-services/core/shared/workout/share-workout.service';
import {Router} from '@angular/router';
import {ShareSingleExerciseService} from '@gw-services/core/shared/single-exercise/share-single-exercise.service';
import {Config} from '@gw-config/core';

@Component({
  selector: 'app-workout-detail',
  templateUrl: './workout-detail.component.html',
  styleUrls: ['./workout-detail.component.css']
})
export class WorkoutDetailComponent implements OnInit {

  // selected workout that user-account want to do
  selectedWorkout: Workout;
  // check loading is show or not
  loading: boolean;
  // exercises list to show in what to know
  exerises: WorkoutExercise[];
  // check change volume model is show or not
  isChangeVolumeModelShow = false;
  // radio volume value
  radioVolumeValue: string;
  // current volume value
  currentVolume: string;
  // number of detailed rounds
  nDetailedRounds: number;
  // detailed rounds temp ( will be changed based on volume )
  detailedRounds: DetailedRounds[];
  nDetailedRoundsTemp: number;

  /**
   *
   * @param shareWorkout - inject share workout service to get selected workout
   * @param shareSingleExercise - inject share single exercise to get selected single exercise
   * @param route - inject router for routing
   */
  constructor(private shareWorkout: ShareWorkoutService,
              private shareSingleExercise: ShareSingleExerciseService,
              private route: Router) {
  }

  /**
   * init data
   */
  ngOnInit() {
    // init data
    this.initData();
    // get selected workout
    this.loading = true;
    this.shareWorkout
      .currentWorkout.subscribe(selectedWorkout => {
      // console.log(selectedWorkout);
      this.selectedWorkout = selectedWorkout;
      this.loading = false;
      // check selected workout existed or not
      // if selected workout not existed - redirect to list of workout
      this.checkSelectedWorkoutExistedOrNot();
    });
  }

  /**
   * check selected workout existed or not, if not redirect to workout list to let user-account choose again
   */
  private checkSelectedWorkoutExistedOrNot() {
    if (this.selectedWorkout == null) {
      this.route.navigate(['/client/workout']);
    } else {
      this.exerises = this.selectedWorkout.detailedRounds[0].exercises;
      this.nDetailedRounds = this.selectedWorkout.detailedRounds.length;
      this.detailedRounds = this.selectedWorkout.detailedRounds;
      this.nDetailedRoundsTemp = this.nDetailedRounds;
    }
  }

  /**
   * init data
   */
  private initData() {
    // create exercises list
    this.exerises = [];
    // init current volume
    this.currentVolume = 'x1';
    // init radio volume of change volume modal
    this.radioVolumeValue = this.currentVolume;
    // init detailed rounds
    this.detailedRounds = [];
    // save current volume to locale storage
    localStorage.setItem(`${Config.currentWorkoutVolume}`, this.currentVolume);
  }

  /**
   *
   * @param selectedSingleExercie - pass selected single exercise to view tutorial
   */
  public goToExerciseVideo(selectedSingleExercie) {
    // pass selected single exercise to video exercise component
    this.shareSingleExercise.changeSingleExercise(selectedSingleExercie);
    // go to video exercise component
    this.route.navigate([`/client/exercise/tutorial/${selectedSingleExercie.slug}`]);
  }

  /**
   * go to workout training componnet
   */
  public startTraining() {
    // go to training
    this.route.navigate([`/client/workout/training/${this.selectedWorkout.slug}`]);
  }

  /**
   * handle event when user-account clicked on 'cancel' button on change volume modal
   */
  public handleCancelChangeVolumeModal() {
    this.isChangeVolumeModelShow = false;
  }

  /**
   * handle event when user-account clicked on 'ok' button on change volume modal
   */
  public handleConfirmChangeVolumeModal() {
    this.isChangeVolumeModelShow = false;
    // change current volume
    this.currentVolume = this.radioVolumeValue;
    this.radioVolumeValue = this.currentVolume;
    this.increaseDetailedRounds();
    localStorage.setItem(`${Config.currentWorkoutVolume}`, this.currentVolume);
  }

  /**
   * open change volume modal
   */
  public openModalChangeVolume() {
    this.isChangeVolumeModelShow = true;
  }

  /**
   * increase detail rounds based on volume
   */
  private increaseDetailedRounds() {
    switch (this.currentVolume) {
      case 'x1':
        this.detailedRounds = [];
        this.detailedRounds = this.detailedRounds.concat(this.selectedWorkout.detailedRounds);
        this.nDetailedRoundsTemp = this.nDetailedRounds;
        break;
      case 'x2':
        this.detailedRounds = [];
        let i = 0;
        while (i < 2) {
          this.detailedRounds = this.detailedRounds.concat(this.selectedWorkout.detailedRounds);
          i++;
        }
        this.nDetailedRoundsTemp = this.nDetailedRounds * 2;
        break;
      case 'x3':
        this.detailedRounds = [];
        let j = 0;
        while (j < 3) {
          this.detailedRounds = this.detailedRounds.concat(this.selectedWorkout.detailedRounds);
          j++;
        }
        this.nDetailedRoundsTemp = this.nDetailedRounds * 3;
        break;
      default:
        break;
    }
  }
}
