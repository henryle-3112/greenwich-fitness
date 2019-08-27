import { Component, OnInit } from '@angular/core';
import { ReadLocalJsonService } from '@gw-services/core/api/read-local-json/read-local-json.service';
import { Router } from '@angular/router';
import { DetailedRounds, SingleExercise, Workout, WorkoutExercise } from '@gw-models/core';
import { ShareWorkoutService } from '@gw-services/core/shared/workout/share-workout.service';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.css']
})
export class WorkoutComponent implements OnInit {
  singleExercises: SingleExercise[];
  workouts: Workout[];
  workoutTitleKeywords: string;
  nWorkoutPerPage: number;
  isLoadingSpinnerShown = true;
  currentWorkoutsPage: number;
  totalWorkouts: number;
  workoutsPerPage: Workout[];
  workoutsTemp: Workout[];
  // tag active
  isBeginnerTagActive: boolean;
  isIntermediateTagActive: boolean;
  isAdvancedTagActive: boolean;
  isShortTagActive: boolean;
  isMediumTagActive: boolean;
  isLongTagActive: boolean;
  isFullBodyTagActive: boolean;
  isUpperTagActive: boolean;
  isCoreTagActive: boolean;
  isLowerTagActive: boolean;
  isNoDistanceTagActive: boolean;
  isNoEquipmentTagActive: boolean;
  currentWorkoutTagValue: string;

  /**
   *
   * @param readLocalJson - inject readLocalJson
   * @param router - inject router
   * @param shareWorkout - inject shareWorkout
   */
  constructor(private readLocalJson: ReadLocalJsonService,
    private router: Router,
    private shareWorkout: ShareWorkoutService) {
  }

  ngOnInit() {
    this.initData();
    this.loadSingleExercises();
  }

  /**
   * init data
   */
  private initData() {
    this.currentWorkoutsPage = 1;
    this.workoutTitleKeywords = '';
    this.nWorkoutPerPage = 8;
    this.currentWorkoutTagValue = '';
    this.isBeginnerTagActive = false;
    this.isIntermediateTagActive = false;
    this.isAdvancedTagActive = false;
    this.isIntermediateTagActive = false;
    this.isShortTagActive = false;
    this.isMediumTagActive = false;
    this.isLongTagActive = false;
    this.isFullBodyTagActive = false;
    this.isUpperTagActive = false;
    this.isCoreTagActive = false;
    this.isLowerTagActive = false;
    this.isNoDistanceTagActive = false;
    this.isNoEquipmentTagActive = false;
  }

  private loadSingleExercises() {
    this.isLoadingSpinnerShown = true;
    this.readLocalJson.getJSON('./assets/workouts.json')
      .subscribe(data => {
        this.singleExercises = [];
        const exercises = data.exercises;
        exercises.map(eachExercise => {
          const eachSingleExercise = this.createSingleExerciseFromJsonObject(eachExercise);
          this.singleExercises.push(eachSingleExercise);
        });
        this.loadWorkouts();
      });
  }

  /**
   *
   * @param eachExercise - json object that will be converted to single exercise object
   */
  private createSingleExerciseFromJsonObject(eachExercise): SingleExercise {
    const singleExercise = new SingleExercise();
    singleExercise.slug = eachExercise.slug;
    singleExercise.title = eachExercise.title;
    singleExercise.smallMobileRetinaPictureUrl = eachExercise.picture_urls.small_mobile_retina;
    singleExercise.largeMobileRetinaPictureUrl = eachExercise.picture_urls.large_mobile_retina;
    singleExercise.loopVideoUrl = eachExercise.loop_video_urls.webp;
    singleExercise.videoUrl = eachExercise.video_urls.mp4;
    return singleExercise;
  }

  /**
   * load workouts
   */
  private loadWorkouts() {
    this.readLocalJson.getJSON('./assets/workouts.json')
      .subscribe(data => {
        this.workouts = [];
        const workouts = data.workouts;
        for (const eachWorkout of workouts) {
          let isExisted = false;
          for (const selectedWorkout of this.workouts) {
            if (selectedWorkout.title.localeCompare(eachWorkout.title) === 0) {
              isExisted = true;
              break;
            }
          }
          if (!isExisted) {
            const eachSingleWorkout = this.createWorkoutFromJsonObject(eachWorkout);
            this.workouts.push(eachSingleWorkout);
          }
        }
        this.isLoadingSpinnerShown = false;
        this.totalWorkouts = this.workouts.length;
        this.workoutsTemp = this.workouts;
        this.loadWorkoutsPerPage();
      });
  }

  /**
   *
   * @param eachWorkout - json object that will be converted to workout object
   */
  private createWorkoutFromJsonObject(eachWorkout): Workout {
    const workout = new Workout();
    workout.slug = eachWorkout.slug;
    workout.title = eachWorkout.title;
    workout.roundsCount = Number(eachWorkout.rounds_count);
    workout.volumeDescription = eachWorkout.volume_description;
    const focus = eachWorkout.focus;
    workout.focus = focus[0];
    workout.smallMobileRetinaPictureUrl = eachWorkout.picture_urls.small_mobile_retina;
    workout.largeMobileRetinaPictureUrl = eachWorkout.picture_urls.large_mobile_retina;
    const detailedRounds = eachWorkout.detailed_rounds;
    this.setDetailedRoundsForEachWorkout(workout, detailedRounds);
    return workout;
  }

  /**
   *
   * @param workout - workout that will be set detailed rounds
   * @param detailedRounds - detailed rounds that will be set to workout
   */
  private setDetailedRoundsForEachWorkout(workout: Workout, detailedRounds) {
    workout.detailedRounds = [];
    detailedRounds.map(eachDetailedRound => {
      const selectedDetailedRound = new DetailedRounds();
      selectedDetailedRound.exercises = [];
      const exercises = eachDetailedRound.exercises;
      exercises.map(eachExercise => {
        const dimensions = eachExercise.dimensions;
        const quantity = dimensions[0].quantity;
        const exerciseSlugs = eachExercise.exercise_slug;
        const workoutExercise = new WorkoutExercise();
        for (const eachSingleExercise of this.singleExercises) {
          if (eachSingleExercise.slug.localeCompare(exerciseSlugs) === 0) {
            workoutExercise.exercise = eachSingleExercise;
            workoutExercise.quantity = quantity;
            break;
          }
        }
        selectedDetailedRound.exercises.push(workoutExercise);
      });
      workout.detailedRounds.push(selectedDetailedRound);
    });
  }

  public workoutPageChange(event) {
    this.currentWorkoutsPage = event;
    this.isLoadingSpinnerShown = true;
    this.reloadWorkoutsTemp();
    this.loadWorkoutsPerPage();
  }

  public searchWorkouts(keyword) {
    this.currentWorkoutsPage = 1;
    this.workoutTitleKeywords = keyword;
    this.reloadWorkoutsTemp();
    this.loadWorkoutsPerPage();
  }

  private loadWorkoutsPerPage() {
    const startIndex = ((this.currentWorkoutsPage - 1) * 8) + 1;
    this.workoutsPerPage = this.workoutsTemp.slice(startIndex - 1, startIndex + 7);
    this.isLoadingSpinnerShown = false;
  }

  private reloadWorkoutsTemp() {
    if (this.workoutTitleKeywords.localeCompare('') === 0 && this.currentWorkoutTagValue.localeCompare('') === 0) {
      this.workoutsTemp = this.workouts;
    } else if (this.workoutTitleKeywords.localeCompare('') !== 0 && this.currentWorkoutTagValue.localeCompare('') !== 0) {
      this.workoutsTemp = [];
      this.workouts.map(eachWorkout => {
        if (
          eachWorkout.title &&
          eachWorkout.focus &&
          eachWorkout.title.includes(this.workoutTitleKeywords) &&
          eachWorkout.focus.includes(this.currentWorkoutTagValue)) {
          this.workoutsTemp.push(eachWorkout);
        }
      });
    } else if (this.workoutTitleKeywords.localeCompare('') !== 0) {
      this.workoutsTemp = [];
      this.workouts.map(eachWorkout => {
        if (eachWorkout.title.includes(this.workoutTitleKeywords)) {
          this.workoutsTemp.push(eachWorkout);
        }
      });
    } else {
      this.workoutsTemp = [];
      this.workouts.map(eachWorkout => {
        if (eachWorkout.focus && eachWorkout.focus.includes(this.currentWorkoutTagValue)) {
          this.workoutsTemp.push(eachWorkout);
        }
      });
    }
    this.totalWorkouts = this.workoutsTemp.length;
  }

  public handleTagActive(tag: string) {
    switch (tag) {
      case 'beginner':
        this.activeBeginnerTag();
        this.tagChanged();
        break;
      case 'intermediate':
        this.activeIntermediateTag();
        this.tagChanged();
        break;
      case 'advanced':
        this.activeAdvancedTag();
        this.tagChanged();
        break;
      case 'short':
        this.activeShortTag();
        this.tagChanged();
        break;
      case 'medium':
        this.activeMediumTag();
        this.tagChanged();
        break;
      case 'long':
        this.activeLongTag();
        this.tagChanged();
        break;
      case 'full_body':
        this.activeFullBodyTag();
        this.tagChanged();
        break;
      case 'upper':
        this.activeUpperTag();
        this.tagChanged();
        break;
      case 'core':
        this.activeCoreTag();
        this.tagChanged();
        break;
      case 'lower':
        this.activeLowerTag();
        this.tagChanged();
        break;
      case 'no_distance':
        this.activeNoDistanceTag();
        this.tagChanged();
        break;
      case 'no_equipment':
        this.activeNoEquipmentTag();
        this.tagChanged();
        break;
      default:
        break;
    }
  }

  /**
   * active beginner tag
   */
  private activeBeginnerTag() {
    this.isBeginnerTagActive = true;
    this.isIntermediateTagActive = false;
    this.isAdvancedTagActive = false;
    this.isIntermediateTagActive = false;
    this.isShortTagActive = false;
    this.isMediumTagActive = false;
    this.isLongTagActive = false;
    this.isFullBodyTagActive = false;
    this.isUpperTagActive = false;
    this.isCoreTagActive = false;
    this.isLowerTagActive = false;
    this.isNoDistanceTagActive = false;
    this.isNoEquipmentTagActive = false;
    this.currentWorkoutTagValue = 'beginner';
  }

  /**
   * active intermediate tag
   */
  private activeIntermediateTag() {
    this.isBeginnerTagActive = false;
    this.isIntermediateTagActive = true;
    this.isAdvancedTagActive = false;
    this.isShortTagActive = false;
    this.isMediumTagActive = false;
    this.isLongTagActive = false;
    this.isFullBodyTagActive = false;
    this.isUpperTagActive = false;
    this.isCoreTagActive = false;
    this.isLowerTagActive = false;
    this.isNoDistanceTagActive = false;
    this.isNoEquipmentTagActive = false;
    this.currentWorkoutTagValue = 'intermediate';
  }

  /**
   * active advanced tag
   */
  private activeAdvancedTag() {
    this.isBeginnerTagActive = false;
    this.isIntermediateTagActive = false;
    this.isAdvancedTagActive = true;
    this.isIntermediateTagActive = false;
    this.isShortTagActive = false;
    this.isMediumTagActive = false;
    this.isLongTagActive = false;
    this.isFullBodyTagActive = false;
    this.isUpperTagActive = false;
    this.isCoreTagActive = false;
    this.isLowerTagActive = false;
    this.isNoDistanceTagActive = false;
    this.isNoEquipmentTagActive = false;
    this.currentWorkoutTagValue = 'advanced';
  }

  /**
   * active short tag
   */
  private activeShortTag() {
    this.isBeginnerTagActive = false;
    this.isIntermediateTagActive = false;
    this.isAdvancedTagActive = false;
    this.isIntermediateTagActive = false;
    this.isShortTagActive = true;
    this.isMediumTagActive = false;
    this.isLongTagActive = false;
    this.isFullBodyTagActive = false;
    this.isUpperTagActive = false;
    this.isCoreTagActive = false;
    this.isLowerTagActive = false;
    this.isNoDistanceTagActive = false;
    this.isNoEquipmentTagActive = false;
    this.currentWorkoutTagValue = 'short';
  }

  /**
   * active medium tag
   */
  private activeMediumTag() {
    this.isBeginnerTagActive = false;
    this.isIntermediateTagActive = false;
    this.isAdvancedTagActive = false;
    this.isIntermediateTagActive = false;
    this.isShortTagActive = false;
    this.isMediumTagActive = true;
    this.isLongTagActive = false;
    this.isFullBodyTagActive = false;
    this.isUpperTagActive = false;
    this.isCoreTagActive = false;
    this.isLowerTagActive = false;
    this.isNoDistanceTagActive = false;
    this.isNoEquipmentTagActive = false;
    this.currentWorkoutTagValue = 'medium';
  }

  /**
   * active long tag
   */
  private activeLongTag() {
    this.isBeginnerTagActive = false;
    this.isIntermediateTagActive = false;
    this.isAdvancedTagActive = false;
    this.isIntermediateTagActive = false;
    this.isShortTagActive = false;
    this.isMediumTagActive = false;
    this.isLongTagActive = true;
    this.isFullBodyTagActive = false;
    this.isUpperTagActive = false;
    this.isCoreTagActive = false;
    this.isLowerTagActive = false;
    this.isNoDistanceTagActive = false;
    this.isNoEquipmentTagActive = false;
    this.currentWorkoutTagValue = 'long';
  }

  /**
   * active full body tag
   */
  private activeFullBodyTag() {
    this.isBeginnerTagActive = false;
    this.isIntermediateTagActive = false;
    this.isAdvancedTagActive = false;
    this.isIntermediateTagActive = false;
    this.isShortTagActive = false;
    this.isMediumTagActive = false;
    this.isLongTagActive = false;
    this.isFullBodyTagActive = true;
    this.isUpperTagActive = false;
    this.isCoreTagActive = false;
    this.isLowerTagActive = false;
    this.isNoDistanceTagActive = false;
    this.isNoEquipmentTagActive = false;
    this.currentWorkoutTagValue = 'full_body';
  }

  /**
   * active upper tag
   */
  private activeUpperTag() {
    this.isBeginnerTagActive = false;
    this.isIntermediateTagActive = false;
    this.isAdvancedTagActive = false;
    this.isIntermediateTagActive = false;
    this.isShortTagActive = false;
    this.isMediumTagActive = false;
    this.isLongTagActive = false;
    this.isFullBodyTagActive = false;
    this.isUpperTagActive = true;
    this.isCoreTagActive = false;
    this.isLowerTagActive = false;
    this.isNoDistanceTagActive = false;
    this.isNoEquipmentTagActive = false;
    this.currentWorkoutTagValue = 'upper';
  }

  /**
   * active core tag
   */
  private activeCoreTag() {
    this.isBeginnerTagActive = false;
    this.isIntermediateTagActive = false;
    this.isAdvancedTagActive = false;
    this.isIntermediateTagActive = false;
    this.isShortTagActive = false;
    this.isMediumTagActive = false;
    this.isLongTagActive = false;
    this.isFullBodyTagActive = false;
    this.isUpperTagActive = false;
    this.isCoreTagActive = true;
    this.isLowerTagActive = false;
    this.isNoDistanceTagActive = false;
    this.isNoEquipmentTagActive = false;
    this.currentWorkoutTagValue = 'core';
  }

  /**
   * active lower tag
   */
  private activeLowerTag() {
    this.isBeginnerTagActive = false;
    this.isIntermediateTagActive = false;
    this.isAdvancedTagActive = false;
    this.isIntermediateTagActive = false;
    this.isShortTagActive = false;
    this.isMediumTagActive = false;
    this.isLongTagActive = false;
    this.isFullBodyTagActive = false;
    this.isUpperTagActive = false;
    this.isCoreTagActive = false;
    this.isLowerTagActive = true;
    this.isNoDistanceTagActive = false;
    this.isNoEquipmentTagActive = false;
    this.currentWorkoutTagValue = 'lower';
  }

  /**
   * active no distance tag
   */
  private activeNoDistanceTag() {
    this.isBeginnerTagActive = false;
    this.isIntermediateTagActive = false;
    this.isAdvancedTagActive = false;
    this.isIntermediateTagActive = false;
    this.isShortTagActive = false;
    this.isMediumTagActive = false;
    this.isLongTagActive = false;
    this.isFullBodyTagActive = false;
    this.isUpperTagActive = false;
    this.isCoreTagActive = false;
    this.isLowerTagActive = false;
    this.isNoDistanceTagActive = true;
    this.isNoEquipmentTagActive = false;
    this.currentWorkoutTagValue = 'no_distance';
  }

  /**
   * active no equipment tag
   */
  private activeNoEquipmentTag() {
    this.isBeginnerTagActive = false;
    this.isIntermediateTagActive = false;
    this.isAdvancedTagActive = false;
    this.isIntermediateTagActive = false;
    this.isShortTagActive = false;
    this.isMediumTagActive = false;
    this.isLongTagActive = false;
    this.isFullBodyTagActive = false;
    this.isUpperTagActive = false;
    this.isCoreTagActive = false;
    this.isLowerTagActive = false;
    this.isNoDistanceTagActive = false;
    this.isNoEquipmentTagActive = true;
    this.currentWorkoutTagValue = 'no_equipment';
  }

  private tagChanged() {
    this.currentWorkoutsPage = 1;
    this.reloadWorkoutsTemp();
    this.loadWorkoutsPerPage();
  }

  public goToWorkoutDetail(selectedWorkout) {
    // pass selected workout to workout detail component
    this.shareWorkout.changeWorkout(selectedWorkout);
    const workoutDetailUrl = `/client/workout/${selectedWorkout.slug}`;
    this.router.navigate([workoutDetailUrl]);
  }
}
