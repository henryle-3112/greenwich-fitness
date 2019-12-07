import {Component, OnInit} from '@angular/core';
import {Coach, DetailedRounds, SingleExercise, Training, UserProfile, Workout, WorkoutExercise} from '@gw-models';
import {
  ShareCoachService,
  ShareMembershipScheduleService,
  ShareSingleExerciseService,
  ShareTrainingService,
  ShareUserProfileService,
  ShareWorkoutService
} from '@gw-services/shared';
import {Router} from '@angular/router';
import {ReadLocalJsonService, TrainingService} from '@gw-services/api';
import {Config} from '@gw-config';
import {NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-coach-schedule-detail',
  templateUrl: './coach-schedule-detail.component.html',
  styleUrls: ['./coach-schedule-detail.component.css']
})
export class CoachScheduleDetailComponent implements OnInit {
  selectedMembershipSchedule: Training;
  selectedUserProfile: UserProfile;
  selectedCoach: Coach;
  trainings: Training[];
  isLoadingSpinnerShown = true;
  singleExercises: SingleExercise[];

  /**
   *
   * @param shareMembershipScheduleService - inject shareMembershipScheduleService
   * @param shareSingleExerciseService - inject shareSingleExerciseService
   * @param shareWorkoutService - inject shareWorkoutService
   * @param readLocalJson - inject readLocalJson
   * @param shareCoachService - inject shareCoachService
   * @param shareUserProfileService - inject shareUserProfileService
   * @param trainingService - inject trainingService
   * @param notification - inject notification
   * @param shareTrainingService - inject notification
   * @param router - inject router
   */
  constructor(private shareMembershipScheduleService: ShareMembershipScheduleService,
              private shareSingleExerciseService: ShareSingleExerciseService,
              private shareWorkoutService: ShareWorkoutService,
              private readLocalJson: ReadLocalJsonService,
              private shareCoachService: ShareCoachService,
              private shareUserProfileService: ShareUserProfileService,
              private trainingService: TrainingService,
              private notification: NzNotificationService,
              private shareTrainingService: ShareTrainingService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.singleExercises = [];
    this.getSelectedUserProfile();
  }

  /**
   *
   * @param selectedTraining - selected training that user want to start
   */
  public startTraining(selectedTraining: Training): void {
    const xPostition = selectedTraining.name.indexOf('x');
    const nRepetitions = selectedTraining.name.substring(0, xPostition - 1);
    const trainingName = selectedTraining.name.substring(xPostition + 2);
    this.loadSingExercises(nRepetitions, trainingName, selectedTraining);
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
   * get selected user profile
   */
  private getSelectedUserProfile(): void {
    this.isLoadingSpinnerShown = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          this.getSelectedCoach();
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get selected coach
   */
  private getSelectedCoach(): void {
    this.shareCoachService.currentCoach
      .subscribe(selectedCoach => {
        if (selectedCoach) {
          this.selectedCoach = selectedCoach;
          this.getSelectedMembershipSchedule();
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * get selected membership schedule
   */
  private getSelectedMembershipSchedule(): void {
    this.isLoadingSpinnerShown = true;
    this.shareMembershipScheduleService.currentMembershipSchedule
      .subscribe(selectedMembershipSchedule => {
        if (selectedMembershipSchedule) {
          this.selectedMembershipSchedule = selectedMembershipSchedule;
          this.getTrainings();
        } else {
          this.router.navigate(['/client']);
        }
        // hide isLoadingSpinnerShown component
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get trainings by user's profile and coach and training date
   */
  private getTrainings(): void {
    this.isLoadingSpinnerShown = true;
    const selectedUserProfileId = this.selectedUserProfile.id;
    const selectedCoachId = this.selectedCoach.id;
    const trainingDate = this.selectedMembershipSchedule.trainingDate;
    const getTrainingsUrl = `${Config.apiBaseUrl}/
${Config.apiTrainingManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiCoaches}/
${selectedCoachId}?
${Config.trainingDateParameter}=${trainingDate}`;
    this.trainingService.getTrainings(getTrainingsUrl)
      .subscribe(response => {
        if (response) {
          this.showStatusButtonForEachTraining(response.body);
          this.trainings = response.body;
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param trainings - trainings that will be set status button (1 is start, -1 is not done)
   */
  private showStatusButtonForEachTraining(trainings: Training[]): void {
    let isAllTrainingNotDone = true;
    let i = 0;
    while (i < trainings.length) {
      if (trainings[i].status === 1) {
        isAllTrainingNotDone = false;
        trainings[i].statusButton = 1;
      } else if (trainings[i].status === 2) {
        isAllTrainingNotDone = false;
        trainings[i].statusButton = 0;
      } else if (trainings[i].status === -1 && i !== 0 && trainings[i - 1].status === 1) {
        trainings[i].statusButton = 0;
      } else {
        trainings[i].statusButton = -1;
      }
      i++;
    }
    // if all trainings are not done, the first training will be activated
    if (isAllTrainingNotDone) {
      trainings[0].statusButton = 0;
    }
  }

  /**
   *
   * @param nRepetitions - number of repetitions that user want to do
   * @param trainingName - training name that user want to do
   * @param selectedTraining - selected training that user want to do
   */
  private loadSingExercises(nRepetitions: string, trainingName: string, selectedTraining: Training): void {
    this.isLoadingSpinnerShown = true;
    this.readLocalJson.getJSON('./assets/workouts.json')
      .subscribe(data => {
        let isTrainingFound = false;
        const exercises = data.exercises;
        let selectedSingleExercise;
        for (const eachExercise of exercises) {
          if (eachExercise.title.localeCompare(trainingName) === 0) {
            isTrainingFound = true;
            selectedSingleExercise = this.createSingleExerciseFromJsonObject(eachExercise);
            this.singleExercises.push(selectedSingleExercise);
          } else {
            const eachSingleExercise = this.createSingleExerciseFromJsonObject(eachExercise);
            this.singleExercises.push(eachSingleExercise);
          }
        }
        if (isTrainingFound) {
          this.startSingleExercise(nRepetitions, selectedSingleExercise, selectedTraining);
        } else {
          this.loadWorkouts(nRepetitions, trainingName, selectedTraining);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param eachExercise - json object that will be converted to single exercise object
   */
  private createSingleExerciseFromJsonObject(eachExercise: any): SingleExercise {
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
   *
   * @param nRepetitons - number of repetitions that user want to do
   * @param selectedSingleExercise - selected single exercise that user want to do
   * @param selectedTraining - selected training that user want to do
   */
  private startSingleExercise(nRepetitons: string, selectedSingleExercise: SingleExercise, selectedTraining: Training): void {
    localStorage.setItem(Config.currentRepetitions, nRepetitons);
    this.shareSingleExerciseService.changeSingleExercise(selectedSingleExercise);
    this.shareTrainingService.changeTraining(selectedTraining);
    this.router.navigate([`/client/exercise/training/${selectedSingleExercise.slug}`]);
  }

  /**
   * load workouts
   */
  private loadWorkouts(nRepetitions: string, trainingName: string, selectedTraining: Training): void {
    let isTrainingFound = false;
    this.isLoadingSpinnerShown = true;
    this.readLocalJson.getJSON('./assets/workouts.json')
      .subscribe(data => {
        let selectedSingleWorkout;
        const listWorkouts = [];
        const workouts = data.workouts;
        for (const eachWorkout of workouts) {
          let isExisted = false;
          for (const selectedWorkout of listWorkouts) {
            if (selectedWorkout.localeCompare(eachWorkout.title) === 0) {
              isExisted = true;
              break;
            }
          }
          if (!isExisted) {
            listWorkouts.push(eachWorkout.title);
            if (trainingName.localeCompare(eachWorkout.title) === 0) {
              isTrainingFound = true;
              selectedSingleWorkout = this.createWorkoutFromJsonObject(eachWorkout);
              break;
            }
          }
        }
        if (!isTrainingFound) {
          this.createNotification('error', 'Error', 'Your training is not found! Please try again!');
        } else {
          this.startWorkout(selectedSingleWorkout, nRepetitions, selectedTraining);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param eachWorkout - json object that will be converted to wokrout object
   */
  private createWorkoutFromJsonObject(eachWorkout: any): Workout {
    const workout = new Workout();
    workout.slug = eachWorkout.slug;
    workout.title = eachWorkout.title;
    workout.roundsCount = Number(eachWorkout.rounds_count);
    workout.volumeDescription = eachWorkout.volume_description;
    const focus = eachWorkout.focus;
    workout.focus = focus[0];
    workout.smallMobileRetinaPictureUrl = eachWorkout.picture_urls.small_mobile_retina;
    workout.largeMobileRetinaPictureUrl = eachWorkout.picture_urls.large_mobile_retina;
    workout.detailedRounds = [];
    const detailedRounds = eachWorkout.detailed_rounds;
    this.setDetailedRoundsForEachWorkout(workout, detailedRounds);
    return workout;
  }

  /**
   *
   * @param workout - workout that will be set detailed rounds
   * @param detailedRounds - detailed rounds that will be set to workouts
   */
  private setDetailedRoundsForEachWorkout(workout: Workout, detailedRounds: any): void {
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

  /**
   *
   * @param selectedSingleWorkout - single workout that user want to do
   * @param nRepetitions - number of repetitons that user want to do
   * @param selectedTraining - selected training that user want to do
   */
  private startWorkout(selectedSingleWorkout: Workout, nRepetitions: string, selectedTraining: Training): void {
    this.shareWorkoutService.changeWorkout(selectedSingleWorkout);
    const currentWorkoutVolume = 'x' + nRepetitions;
    localStorage.setItem(Config.currentWorkoutVolume, currentWorkoutVolume);
    this.shareTrainingService.changeTraining(selectedTraining);
    this.router.navigate([`/client/workout/training/${selectedSingleWorkout.slug}`]);
  }
}
