import {Component, OnInit} from '@angular/core';
import {Coach, DetailedRounds, SingleExercise, Training, UserProfile, Workout, WorkoutExercise} from '@gw-models/core';
import {ShareMembershipScheduleService} from '@gw-services/core/shared/membership-schedule/share-membership-schedule.service';
import {Router} from '@angular/router';
import {TrainingService} from '@gw-services/core/api/training/training.service';
import {ShareCoachService} from '@gw-services/core/shared/coach/share-coach.service';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {ReadLocalJsonService} from '@gw-services/core/api/read-local-json/read-local-json.service';
import {Config} from '@gw-config/core';
import {ShareSingleExerciseService} from '@gw-services/core/shared/single-exercise/share-single-exercise.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {ShareWorkoutService} from '@gw-services/core/shared/workout/share-workout.service';
import {ShareTrainingService} from '@gw-services/core/shared/training/share-training.service';

@Component({
  selector: 'app-coach-schedule-detail',
  templateUrl: './coach-schedule-detail.component.html',
  styleUrls: ['./coach-schedule-detail.component.css']
})
export class CoachScheduleDetailComponent implements OnInit {

  // selected membership schedule
  selectedMembershipSchedule: Training;

  // selected membership
  selectedMembership: UserProfile;

  // selected coach
  selectedCoach: Coach;

  // trainings
  trainings: Training[];

  // check loading component is showing or not
  loading = true;

  // list of single exercises
  singleExercises: SingleExercise[];

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

  ngOnInit() {
    // init single exercises
    this.singleExercises = [];
    // get selected membership
    this.getSelectedMembership();
  }

  /**
   * get selected membership
   */
  private getSelectedMembership() {
    // show loading component
    this.loading = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedMembership = selectedUserProfile;
          // get selected coach
          this.getSelectedCoach();
        } else {
          this.router.navigate(['/client']);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get selected coach
   */
  private getSelectedCoach() {
    this.shareCoachService.currentCoach
      .subscribe(selectedCoach => {
        if (selectedCoach) {
          this.selectedCoach = selectedCoach;
          // get selected membership schedule
          this.getSelectedMembershipSchedule();
        } else {
          this.router.navigate(['/client']);
        }
      });
  }

  /**
   * get selected membership schedule
   */
  private getSelectedMembershipSchedule() {
    // show loading component
    this.loading = true;
    this.shareMembershipScheduleService.currentMembershipSchedule
      .subscribe(selectedMembershipSchedule => {
        if (selectedMembershipSchedule) {
          this.selectedMembershipSchedule = selectedMembershipSchedule;
          // get trainings by user's profile and coach and training's date
          this.getTrainingsByUserProfileIdAndCoachIdAndTrainingDate();
        } else {
          this.router.navigate(['/client']);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get trainings by user's profile and coach
   */
  private getTrainingsByUserProfileIdAndCoachIdAndTrainingDate() {
    // show loading component
    this.loading = true;
    this.trainingService.getTrainingsByUserProfileIdAndCoachIdAndTrainingDate(
      this.selectedMembership.id,
      this.selectedCoach.id,
      this.selectedMembershipSchedule.trainingDate
    ).subscribe((trainings: Training[]) => {
      if (trainings) {
        // check start button start should be activated or not
        // assume all exercises are not done
        let isAllNotDone = true, isAllDone = true;
        let i = 0;
        while (i < trainings.length) {
          if (i !== trainings.length - 1 && trainings[i].status === 1 && trainings[i + 1].status === -1) {
            isAllNotDone = false;
            trainings[i].statusButton = 1;
            trainings[i + 1].statusButton = 0;
            i = i + 2;
          } else if (trainings[i].status === -1) {
            trainings[i].statusButton = -1;
            isAllDone = false;
            i = i + 1;
          } else if (trainings[i].status === 1) {
            isAllNotDone = false;
            trainings[i].statusButton = 1;
            i = i + 1;
          }
        }
        if (isAllNotDone || !isAllDone) {
          trainings[0].statusButton = 0;
        }
        // assign trainings data
        this.trainings = trainings;
      } else {
        this.router.navigate(['/client']);
      }
      // hide loading component
      this.loading = false;
    });
  }

  /**
   *
   * @param selectedTraining - selected training that user want to start
   */
  public startTraining(selectedTraining: Training) {
    // find position of 'x' character
    const xPostition = selectedTraining.name.indexOf('x');
    // get number of repetitons (volume)
    const nRepetitions = selectedTraining.name.substring(0, xPostition - 1);
    // get name of exercise or workout
    const trainingName = selectedTraining.name.substring(xPostition + 2);
    // find selected exercise or selected workout by training's name
    this.loadSingExercises(nRepetitions, trainingName, selectedTraining);
  }

  private loadSingExercises(nRepetitions: string, trainingName: string, selectedTraining: Training) {
    // show loading component
    this.loading = true;
    // load local json
    this.readLocalJson.getJSON('./assets/workouts.json')
      .subscribe(data => {
        // check training is found or not
        let isTrainingFound = false;
        // get single exericses
        const exercises = data.exercises;
        const selectedSingleExercise = new SingleExercise();
        // read exercises
        for (const eachExercise of exercises) {
          if (eachExercise.title.localeCompare(trainingName) === 0) {
            // found exercise
            isTrainingFound = true;
            selectedSingleExercise.slug = eachExercise.slug;
            selectedSingleExercise.title = eachExercise.title;
            selectedSingleExercise.smallMobileRetinaPictureUrl = eachExercise.picture_urls.small_mobile_retina;
            selectedSingleExercise.largeMobileRetinaPictureUrl = eachExercise.picture_urls.large_mobile_retina;
            selectedSingleExercise.loopVideoUrl = eachExercise.loop_video_urls.webp;
            selectedSingleExercise.videoUrl = eachExercise.video_urls.mp4;
            this.singleExercises.push(selectedSingleExercise);
            console.log(`selected single exercise`);
            console.log(selectedSingleExercise);
          } else {
            const eachSingleExercise = new SingleExercise();
            eachSingleExercise.slug = eachExercise.slug;
            eachSingleExercise.title = eachExercise.title;
            eachSingleExercise.smallMobileRetinaPictureUrl = eachExercise.picture_urls.small_mobile_retina;
            eachSingleExercise.largeMobileRetinaPictureUrl = eachExercise.picture_urls.large_mobile_retina;
            eachSingleExercise.loopVideoUrl = eachExercise.loop_video_urls.webp;
            eachSingleExercise.videoUrl = eachExercise.video_urls.mp4;
            this.singleExercises.push(eachSingleExercise);
          }
        }
        if (isTrainingFound) {
          // set current repetitions
          localStorage.setItem(Config.currentRepetitions, nRepetitions);
          // share selected single exercise
          this.shareSingleExerciseService.changeSingleExercise(selectedSingleExercise);
          // pass selected training to single exercise training component
          this.shareTrainingService.changeTraining(selectedTraining);
          // start training single exercise
          this.router.navigate([`/client/exercise/training/${selectedSingleExercise.slug}`]);
        } else {
          // load workouts if training is not found in single exercises list
          this.loadWorkouts(nRepetitions, trainingName);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * load workouts
   */
  private loadWorkouts(nRepetitions: string, trainingName: string) {
    console.log(`List of exercises: `);
    console.log(this.singleExercises);
    // check training is found or not
    let isTrainingFound = false;
    // show loading component
    this.loading = true;
    this.readLocalJson.getJSON('./assets/workouts.json')
      .subscribe(data => {
        // create selected workout if its title is equal to training's name
        const selectedSingleWorkout = new Workout();
        // list of workouts
        const listWorkouts = [];
        // read workouts data from json
        const workouts = data.workouts;
        for (const eachWorkout of workouts) {
          // check current workout existed in the list or not
          let isExisted = false;
          for (const selectedWorkout of listWorkouts) {
            if (selectedWorkout.localeCompare(eachWorkout.title) === 0) {
              isExisted = true;
              break;
            }
          }
          if (!isExisted) {
            // add to list workouts
            listWorkouts.push(eachWorkout.title);
            // check training's name is equal to workout's title or not
            if (trainingName.localeCompare(eachWorkout.title) === 0) {
              // training is found
              isTrainingFound = true;

              selectedSingleWorkout.slug = eachWorkout.slug;
              selectedSingleWorkout.title = eachWorkout.title;
              selectedSingleWorkout.roundsCount = Number(eachWorkout.rounds_count);
              selectedSingleWorkout.volumeDescription = eachWorkout.volume_description;

              const focus = eachWorkout.focus;
              selectedSingleWorkout.focus = focus[0];

              selectedSingleWorkout.smallMobileRetinaPictureUrl = eachWorkout.picture_urls.small_mobile_retina;
              selectedSingleWorkout.largeMobileRetinaPictureUrl = eachWorkout.picture_urls.large_mobile_retina;

              selectedSingleWorkout.detailedRounds = [];
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

                selectedSingleWorkout.detailedRounds.push(selectedDetailedRound);
              });
            }
          }
          if (!isTrainingFound) {
            // show error message to user
            this.createNotification('error', 'Error', 'Your training is not found! Please try again!');
            break;
          } else {
            // go to workout training component
            this.shareWorkoutService.changeWorkout(selectedSingleWorkout);
            // save current volume
            // create current workout volume
            const currentWorkoutVolume = 'x' + nRepetitions;
            localStorage.setItem(Config.currentWorkoutVolume, currentWorkoutVolume);
            // go to workout training component
            this.router.navigate([`/client/workout/training/${selectedSingleWorkout.slug}`]);
            console.log(`Current volume: ${currentWorkoutVolume}`);
            console.log(selectedSingleWorkout);
            break;
          }
        }
        // hide loading component
        this.loading = false;
        // get trainings by training's date and user's profile and coach
        this.getTrainingsByUserProfileIdAndCoachIdAndTrainingDate();
      });
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
}
