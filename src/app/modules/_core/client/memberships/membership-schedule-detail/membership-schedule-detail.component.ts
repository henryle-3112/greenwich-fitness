import {Component, OnInit} from '@angular/core';
import {Coach, Membership, Training} from '@gw-models/core';
import {ShareMembershipScheduleService} from '@gw-services/core/shared/membership-schedule/share-membership-schedule.service';
import {Router} from '@angular/router';
import {ReadLocalJsonService} from '@gw-services/core/api/read-local-json/read-local-json.service';
import {Utils} from '@gw-helpers/core';
import {TrainingService} from '@gw-services/core/api/training/training.service';
import {ShareMembershipService} from '@gw-services/core/shared/membership/share-membership.service';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {CoachService} from '@gw-services/core/api/coach/coach.service';
import {NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-schedule-detail',
  templateUrl: './membership-schedule-detail.component.html',
  styleUrls: ['./membership-schedule-detail.component.css']
})
export class MembershipScheduleDetailComponent implements OnInit {

  // data source for transfer component
  dataSource: any[];

  // list exercises and workouts
  listExercisesAndWorkouts: string[];

  // check loading component is showing or not
  loading: boolean;

  // check transfer component is showing or not
  disabled: boolean;

  // selected membership schedule
  selectedMembershipSchedule: Training;

  // selected coach
  selectedCoach: Coach;

  // selected membership
  selectedMembership: Membership;

  // selected trainings
  selectedTrainings: string[];

  // current date
  currentDate: string;

  /**
   *
   * @param shareMembershipScheduleService - inject shareMembershipScheduleService
   * @param shareMembershipService - inject shareMembershipService
   * @param shareUserProfileService - inject shareUserProfileService
   * @param coachService - inject coachService
   * @param readLocalJson - inject readLocalJson
   * @param trainingService - inject trainingService
   * @param notification - inject notification
   * @param router - inject router
   */
  constructor(private shareMembershipScheduleService: ShareMembershipScheduleService,
              private shareMembershipService: ShareMembershipService,
              private shareUserProfileService: ShareUserProfileService,
              private coachService: CoachService,
              private readLocalJson: ReadLocalJsonService,
              private trainingService: TrainingService,
              private notification: NzNotificationService,
              private router: Router) {
  }

  ngOnInit() {
    // init selected trainings
    this.selectedTrainings = [];
    // init data source for transfer component
    this.dataSource = [];
    // get selected user's profile
    this.getSelectedUserProfile();
  }

  /**
   * get selected user's profile
   */
  private getSelectedUserProfile() {
    // show loading component
    this.loading = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          // get selected coach
          this.getSelectedCoach(selectedUserProfile);
        } else {
          this.router.navigate(['/client']);
        }
      });
    // hide loading component
    this.loading = false;
  }

  /**
   * get selected coach
   */
  private getSelectedCoach(selectedUserProfile) {
    // show loading component
    this.loading = true;
    this.coachService.getCoachByUserProfile(selectedUserProfile, 1)
      .subscribe(selectedCoach => {
        if (selectedCoach) {
          this.selectedCoach = selectedCoach;
          // get selected membership
          this.getSelectedMembership();
        } else {
          this.router.navigate(['/client']);
        }
        // hide loading component
        this.loading = false;
      });

  }

  /**
   * get selected membership
   */
  private getSelectedMembership() {
    // show loading component
    this.loading = true;
    this.shareMembershipService.currentMembership
      .subscribe(selectedMembership => {
        if (selectedMembership) {
          this.selectedMembership = selectedMembership;
          // get selected membership schedule
          this.getSelectedMembershipSchedule();
          // get data source for transfer component
          this.getDataSourceForTransferComponent();
        } else {
          this.router.navigate(['/client']);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get data source for transfer component
   */
  private getDataSourceForTransferComponent() {
    // init list exercises and workouts
    this.listExercisesAndWorkouts = [];
    // load single exercises first
    this.loadSingleExercises();
  }

  /**
   * load single exercises
   */
  private loadSingleExercises() {
    // show loading component
    this.loading = true;
    // load local json
    this.readLocalJson.getJSON('./assets/workouts.json')
      .subscribe(data => {
        const listRepetitions = [10, 25, 50, 100, 250];
        // get single exericses
        const exercises = data.exercises;
        // read exercises
        exercises.map(eachExercise => {
          for (const eachExerciseRepetition of listRepetitions) {
            this.listExercisesAndWorkouts.push(String(eachExerciseRepetition) + ' x ' + eachExercise.title);
          }
        });
        // hide loading component
        this.loading = false;
        // load workouts
        this.loadWorkouts();
      });
  }

  /**
   * load workouts
   */
  private loadWorkouts() {
    // show loading component
    this.loading = true;
    this.readLocalJson.getJSON('./assets/workouts.json')
      .subscribe(data => {
        const listVolumes = ['1 x ', '2 x ', '3 x '];
        const listWorkouts = [];
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
            // add to listExercisesAndWorkouts
            for (const eachVolume of listVolumes) {
              this.listExercisesAndWorkouts.push(eachVolume + eachWorkout.title);
            }
          }
        }
        // hide loading component
        this.loading = false;
        // get trainings by training's date and user's profile and coach
        this.getTrainingsByUserProfileIdAndCoachIdAndTrainingDate();
      });
  }

  private getTrainingsByUserProfileIdAndCoachIdAndTrainingDate() {
    // show loading component
    this.loading = true;
    this.trainingService.getTrainingsByUserProfileIdAndCoachIdAndTrainingDate(
      this.selectedMembership.userProfile.id,
      this.selectedCoach.id,
      this.selectedMembershipSchedule.trainingDate
    ).subscribe((trainings: Training[]) => {
      if (trainings) {
        // init data source for transfer component
        this.initDataSourceForTransferComponent(trainings);
      } else {
        this.router.navigate(['/client']);
      }
      // hide loading component
      this.loading = false;
    });
  }

  /**
   * init data source for transfer component
   */
  private initDataSourceForTransferComponent(trainings: Training[]) {
    // init data source for transfer component
    this.dataSource = [];
    for (let i = 0; i < this.listExercisesAndWorkouts.length; i++) {
      // if current training existed in the database, then move it to the right column
      let isTrainingExisted = false;
      for (const eachTraining of trainings) {
        if (eachTraining.name.localeCompare(this.listExercisesAndWorkouts[i]) === 0) {
          isTrainingExisted = true;
          break;
        }
      }
      this.dataSource.push({
        key: i.toString(),
        title: this.listExercisesAndWorkouts[i],
        direction: isTrainingExisted ? 'right' : ''
      });
      // add to selected trainings
      if (isTrainingExisted) {
        this.selectedTrainings.push(this.listExercisesAndWorkouts[i]);
      }
    }
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
          // check transfer component should be disabled or not
          this.checkTransferComponentIsDisabledOrNot();
        } else {
          this.router.navigate(['/client']);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * check transfer component should be disabled or not
   */
  private checkTransferComponentIsDisabledOrNot() {

    // get current date then compare with training date if current date is greater than training date
    // coach cannot add or update schedule and memberships can not do the trainings

    // get current data as mm/dd/yyyy then convert to date object
    this.currentDate = Utils.getCurrentDate();
    const currentDateObject = new Date(this.currentDate);

    // get training date as mm/dd/yyyy then convert to date object
    const selectedTrainingDate = this.selectedMembershipSchedule.trainingDate;
    const selectedTrainingDateObject = new Date(selectedTrainingDate);

    // check current date is greater than training date or not
    this.disabled = currentDateObject > selectedTrainingDateObject;

    console.log(this.disabled);
  }

  // tslint:disable-next-line:no-any
  filterOption(inputValue: string, item: any): boolean {
    return false;
  }

  search(ret: {}): void {
    console.log('nzSearchChange', ret);
  }

  select(ret: {}): void {
    console.log('nzSelectChange', ret);
  }

  change(ret): void {
    console.log('nzChange', ret);
    const from = ret.from;
    const to = ret.to;
    const trainings = ret.list;
    // transfer from left to right
    if (from.localeCompare('left') === 0 && to.localeCompare('right') === 0) {
      for (const eachTraining of trainings) {
        this.selectedTrainings.push(eachTraining.title);
      }
    } else if (from.localeCompare('right') === 0 && to.localeCompare('left') === 0) {
      const itemPositionsToRemove = [];
      for (const eachTraining of trainings) {
        for (let i = 0; i < this.selectedTrainings.length; i++) {
          if (eachTraining.title.localeCompare(this.selectedTrainings[i]) === 0) {
            itemPositionsToRemove.push(i);
            break;
          }
        }
      }
      for (const selectedPositionToRemove of itemPositionsToRemove) {
        this.selectedTrainings.splice(selectedPositionToRemove, 1);
      }
    }
  }

  /**
   * save membership schedule
   */
  private saveMembershipSchedule() {
    // create list of training objects from selectedTrainings array
    const listOfTrainings = [];
    for (const eachTrainingTitle of this.selectedTrainings) {
      const training = new Training();
      training.name = eachTrainingTitle;
      training.coach = this.selectedCoach;
      training.userProfile = this.selectedMembership.userProfile;
      training.status = 0;
      training.trainingDate = this.currentDate;
      // add to trainings list
      listOfTrainings.push(training);
    }
    // add list of trainings to the database
    this.addTrainingsToServer(listOfTrainings);
  }

  private addTrainingsToServer(listOfTrainings: Training[]) {
    // show loading component
    this.loading = true;
    this.trainingService.addTrainings(listOfTrainings)
      .subscribe(trainings => {
        if (trainings) {
          // show success message to user
          this.createNotification('success', 'Success', 'Your trainings were submitted successfully');
        } else {
          // show error message to user
          this.createNotification('error', 'Error', 'Failure to submit your trainings');
        }
        // hide loading component
        this.loading = false;
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
