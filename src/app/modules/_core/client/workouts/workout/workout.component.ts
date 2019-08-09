import {Component, OnInit} from '@angular/core';
import {ReadLocalJsonService} from '@gw-services/core/api/read-local-json/read-local-json.service';
import {Router} from '@angular/router';
import {DetailedRounds, SingleExercise, Workout, WorkoutExercise} from '@gw-models/core';
import {ShareWorkoutService} from '@gw-services/core/shared/workout/share-workout.service';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.css']
})
export class WorkoutComponent implements OnInit {
  // workouts data
  singleExercises: SingleExercise[];
  // all workouts data
  workouts: Workout[];
  // search value - return exercises and change pagination based on keywords
  searchValue: string;
  // number of workout per page
  nWorkoutPerPage: number;
  // loading component is show ot not
  loading = true;
  // current page
  currentPage: number;
  // total exercises;
  totalWorkouts: number;
  // startIndex to get workouts per page
  startIndex: number;
  // workouts data per page
  workoutsPerPage: Workout[];
  // need to create workouts temp to load data base on current page and keywords
  workoutsTemp: Workout[];

  // tag active
  isBeginnerActive: boolean;
  isIntermediateActive: boolean;
  isAdvancedActive: boolean;
  isShortActive: boolean;
  isMediumActive: boolean;
  isLongActive: boolean;
  isFullBodyActive: boolean;
  isUpperActive: boolean;
  isCoreActive: boolean;
  isLowerActive: boolean;
  isNoDistanceActive: boolean;
  isNoEquipmentActive: boolean;

  // current workout tag value
  currentWorkoutTagValue: string;

  constructor(private readLocalJson: ReadLocalJsonService,
              private router: Router,
              private shareWorkout: ShareWorkoutService) {
  }

  ngOnInit() {
    // init data
    this.initData();
    // load workouts
    this.loadSingleExercises();
  }

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
            const eachSingleWorkout = new Workout();

            eachSingleWorkout.slug = eachWorkout.slug;
            eachSingleWorkout.title = eachWorkout.title;
            eachSingleWorkout.roundsCount = Number(eachWorkout.rounds_count);
            eachSingleWorkout.volumeDescription = eachWorkout.volume_description;

            const focus = eachWorkout.focus;
            eachSingleWorkout.focus = focus[0];

            eachSingleWorkout.smallMobileRetinaPictureUrl = eachWorkout.picture_urls.small_mobile_retina;
            eachSingleWorkout.largeMobileRetinaPictureUrl = eachWorkout.picture_urls.large_mobile_retina;

            eachSingleWorkout.detailedRounds = [];
            const detailedRounds = eachWorkout.detailed_rounds;

            detailedRounds.map(eachDetailedRound => {
              // create detailed round object
              const selectedDetailedRound = new DetailedRounds();
              selectedDetailedRound.exercises = [];

              const exercises = eachDetailedRound.exercises;
              exercises.map(eachExercise => {
                // get quantity
                const dimensions = eachExercise.dimensions;
                const quantity = dimensions[0].quantity;

                // get exercise
                const exerciseSlugs = eachExercise.exercise_slug;
                // create workout exercise object
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

              eachSingleWorkout.detailedRounds.push(selectedDetailedRound);
            });
            this.workouts.push(eachSingleWorkout);
          }
        }
        this.loading = false;
        this.totalWorkouts = this.workouts.length;
        this.workoutsTemp = this.workouts;
        // load workouts per page
        this.loadWorkoutsPerPage();
      });
  }

  private loadSingleExercises() {
    this.loading = true;
    this.readLocalJson.getJSON('./assets/workouts.json')
      .subscribe(data => {
        this.singleExercises = [];
        const exercises = data.exercises;
        exercises.map(eachExercise => {
          const eachSingleExercise = new SingleExercise();
          eachSingleExercise.slug = eachExercise.slug;
          eachSingleExercise.title = eachExercise.title;
          eachSingleExercise.smallMobileRetinaPictureUrl = eachExercise.picture_urls.small_mobile_retina;
          eachSingleExercise.largeMobileRetinaPictureUrl = eachExercise.picture_urls.large_mobile_retina;
          eachSingleExercise.loopVideoUrl = eachExercise.loop_video_urls.webp;
          eachSingleExercise.videoUrl = eachExercise.video_urls.mp4;
          this.singleExercises.push(eachSingleExercise);
        });
        // load workouts data
        this.loadWorkouts();
      });
  }

  private initData() {
    // set current page
    this.currentPage = 1;
    // init searchValue
    this.searchValue = '';
    // init number workouts per page
    this.nWorkoutPerPage = 8;
    // init current tag value
    this.currentWorkoutTagValue = '';

    this.isBeginnerActive = false;
    this.isIntermediateActive = false;
    this.isAdvancedActive = false;
    this.isIntermediateActive = false;
    this.isShortActive = false;
    this.isMediumActive = false;
    this.isLongActive = false;
    this.isFullBodyActive = false;
    this.isUpperActive = false;
    this.isCoreActive = false;
    this.isLowerActive = false;
    this.isNoDistanceActive = false;
    this.isNoEquipmentActive = false;
  }

  public workoutPageChange(event) {
    // change current page
    this.currentPage = event;
    // show loading
    this.loading = true;
    // reload data based on keywords
    this.reloadWorkoutsTemp();
    // load data for new page
    this.loadWorkoutsPerPage();
  }

  public searchWorkouts(keyword) {
    // reset current page
    this.currentPage = 1;
    // change search value
    this.searchValue = keyword;
    // reload data based on keywords and tags
    this.reloadWorkoutsTemp();
    // load data for new page
    this.loadWorkoutsPerPage();
  }

  private loadWorkoutsPerPage() {
    // init startIndex
    this.startIndex = ((this.currentPage - 1) * 8) + 1;
    // get workouts data per page
    this.workoutsPerPage = this.workoutsTemp.slice(this.startIndex - 1, this.startIndex + 7);
    this.loading = false;
  }

  private reloadWorkoutsTemp() {
    // console.log(`Current Workout Tag Value: ${this.currentWorkoutTagValue}`);
    // console.log(`Current Search Value: ${this.searchValue}`);
    if (this.searchValue.localeCompare('') === 0 && this.currentWorkoutTagValue.localeCompare('') === 0) {
      this.workoutsTemp = this.workouts;
    } else if (this.searchValue.localeCompare('') !== 0 && this.currentWorkoutTagValue.localeCompare('') !== 0) {
      this.workoutsTemp = [];
      this.workouts.map(eachWorkout => {
        if (
          eachWorkout.title &&
          eachWorkout.focus &&
          eachWorkout.title.includes(this.searchValue) &&
          eachWorkout.focus.includes(this.currentWorkoutTagValue)) {
          this.workoutsTemp.push(eachWorkout);
        }
      });
    } else if (this.searchValue.localeCompare('') !== 0) {
      this.workoutsTemp = [];
      this.workouts.map(eachWorkout => {
        if (eachWorkout.title.includes(this.searchValue)) {
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
        this.isBeginnerActive = true;
        this.isIntermediateActive = false;
        this.isAdvancedActive = false;
        this.isIntermediateActive = false;
        this.isShortActive = false;
        this.isMediumActive = false;
        this.isLongActive = false;
        this.isFullBodyActive = false;
        this.isUpperActive = false;
        this.isCoreActive = false;
        this.isLowerActive = false;
        this.isNoDistanceActive = false;
        this.isNoEquipmentActive = false;
        this.currentWorkoutTagValue = 'beginner';
        this.tagChanged();
        break;
      case 'intermediate':
        this.isBeginnerActive = false;
        this.isIntermediateActive = true;
        this.isAdvancedActive = false;
        this.isShortActive = false;
        this.isMediumActive = false;
        this.isLongActive = false;
        this.isFullBodyActive = false;
        this.isUpperActive = false;
        this.isCoreActive = false;
        this.isLowerActive = false;
        this.isNoDistanceActive = false;
        this.isNoEquipmentActive = false;
        this.currentWorkoutTagValue = 'intermediate';
        this.tagChanged();
        break;
      case 'advanced':
        this.isBeginnerActive = false;
        this.isIntermediateActive = false;
        this.isAdvancedActive = true;
        this.isIntermediateActive = false;
        this.isShortActive = false;
        this.isMediumActive = false;
        this.isLongActive = false;
        this.isFullBodyActive = false;
        this.isUpperActive = false;
        this.isCoreActive = false;
        this.isLowerActive = false;
        this.isNoDistanceActive = false;
        this.isNoEquipmentActive = false;
        this.currentWorkoutTagValue = 'advanced';
        this.tagChanged();
        break;
      case 'short':
        this.isBeginnerActive = false;
        this.isIntermediateActive = false;
        this.isAdvancedActive = false;
        this.isIntermediateActive = false;
        this.isShortActive = true;
        this.isMediumActive = false;
        this.isLongActive = false;
        this.isFullBodyActive = false;
        this.isUpperActive = false;
        this.isCoreActive = false;
        this.isLowerActive = false;
        this.isNoDistanceActive = false;
        this.isNoEquipmentActive = false;
        this.currentWorkoutTagValue = 'short';
        this.tagChanged();
        break;
      case 'medium':
        this.isBeginnerActive = false;
        this.isIntermediateActive = false;
        this.isAdvancedActive = false;
        this.isIntermediateActive = false;
        this.isShortActive = false;
        this.isMediumActive = true;
        this.isLongActive = false;
        this.isFullBodyActive = false;
        this.isUpperActive = false;
        this.isCoreActive = false;
        this.isLowerActive = false;
        this.isNoDistanceActive = false;
        this.isNoEquipmentActive = false;
        this.currentWorkoutTagValue = 'medium';
        this.tagChanged();
        break;
      case 'long':
        this.isBeginnerActive = false;
        this.isIntermediateActive = false;
        this.isAdvancedActive = false;
        this.isIntermediateActive = false;
        this.isShortActive = false;
        this.isMediumActive = false;
        this.isLongActive = true;
        this.isFullBodyActive = false;
        this.isUpperActive = false;
        this.isCoreActive = false;
        this.isLowerActive = false;
        this.isNoDistanceActive = false;
        this.isNoEquipmentActive = false;
        this.currentWorkoutTagValue = 'long';
        this.tagChanged();
        break;
      case 'full_body':
        this.isBeginnerActive = false;
        this.isIntermediateActive = false;
        this.isAdvancedActive = false;
        this.isIntermediateActive = false;
        this.isShortActive = false;
        this.isMediumActive = false;
        this.isLongActive = false;
        this.isFullBodyActive = true;
        this.isUpperActive = false;
        this.isCoreActive = false;
        this.isLowerActive = false;
        this.isNoDistanceActive = false;
        this.isNoEquipmentActive = false;
        this.currentWorkoutTagValue = 'full_body';
        this.tagChanged();
        break;
      case 'upper':
        this.isBeginnerActive = false;
        this.isIntermediateActive = false;
        this.isAdvancedActive = false;
        this.isIntermediateActive = false;
        this.isShortActive = false;
        this.isMediumActive = false;
        this.isLongActive = false;
        this.isFullBodyActive = false;
        this.isUpperActive = true;
        this.isCoreActive = false;
        this.isLowerActive = false;
        this.isNoDistanceActive = false;
        this.isNoEquipmentActive = false;
        this.currentWorkoutTagValue = 'upper';
        this.tagChanged();
        break;
      case 'core':
        this.isBeginnerActive = false;
        this.isIntermediateActive = false;
        this.isAdvancedActive = false;
        this.isIntermediateActive = false;
        this.isShortActive = false;
        this.isMediumActive = false;
        this.isLongActive = false;
        this.isFullBodyActive = false;
        this.isUpperActive = false;
        this.isCoreActive = true;
        this.isLowerActive = false;
        this.isNoDistanceActive = false;
        this.isNoEquipmentActive = false;
        this.currentWorkoutTagValue = 'core';
        this.tagChanged();
        break;
      case 'lower':
        this.isBeginnerActive = false;
        this.isIntermediateActive = false;
        this.isAdvancedActive = false;
        this.isIntermediateActive = false;
        this.isShortActive = false;
        this.isMediumActive = false;
        this.isLongActive = false;
        this.isFullBodyActive = false;
        this.isUpperActive = false;
        this.isCoreActive = false;
        this.isLowerActive = true;
        this.isNoDistanceActive = false;
        this.isNoEquipmentActive = false;
        this.currentWorkoutTagValue = 'lower';
        this.tagChanged();
        break;
      case 'no_distance':
        this.isBeginnerActive = false;
        this.isIntermediateActive = false;
        this.isAdvancedActive = false;
        this.isIntermediateActive = false;
        this.isShortActive = false;
        this.isMediumActive = false;
        this.isLongActive = false;
        this.isFullBodyActive = false;
        this.isUpperActive = false;
        this.isCoreActive = false;
        this.isLowerActive = false;
        this.isNoDistanceActive = true;
        this.isNoEquipmentActive = false;
        this.currentWorkoutTagValue = 'no_distance';
        this.tagChanged();
        break;
      case 'no_equipment':
        this.isBeginnerActive = false;
        this.isIntermediateActive = false;
        this.isAdvancedActive = false;
        this.isIntermediateActive = false;
        this.isShortActive = false;
        this.isMediumActive = false;
        this.isLongActive = false;
        this.isFullBodyActive = false;
        this.isUpperActive = false;
        this.isCoreActive = false;
        this.isLowerActive = false;
        this.isNoDistanceActive = false;
        this.isNoEquipmentActive = true;
        this.currentWorkoutTagValue = 'no_equipment';
        this.tagChanged();
        break;
      default:
        break;
    }
  }

  private tagChanged() {
    // reset current page
    this.currentPage = 1;
    // reload data based on keywords and tags
    this.reloadWorkoutsTemp();
    // load data for new page
    this.loadWorkoutsPerPage();
  }

  public goToWorkoutDetail(selectedWorkout) {
    // pass selected workout to workout detail component
    this.shareWorkout.changeWorkout(selectedWorkout);
    // go to workout detail component
    const workoutDetailUrl = `/client/workout/${selectedWorkout.slug}`;
    this.router.navigate([workoutDetailUrl]);
  }
}
