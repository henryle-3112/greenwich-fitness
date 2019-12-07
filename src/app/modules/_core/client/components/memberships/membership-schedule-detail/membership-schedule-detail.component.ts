import {Component, OnInit} from '@angular/core';
import {Coach, Membership, Training} from '@gw-models';
import {ShareMembershipScheduleService, ShareMembershipService, ShareUserProfileService} from '@gw-services/shared';
import {Router} from '@angular/router';
import {CoachService, ReadLocalJsonService, TrainingService} from '@gw-services/api';
import {Utils} from '@gw-helpers';
import {NzNotificationService} from 'ng-zorro-antd';
import {Config} from '@gw-config';

@Component({
  selector: 'app-schedule-detail',
  templateUrl: './membership-schedule-detail.component.html',
  styleUrls: ['./membership-schedule-detail.component.css']
})
export class MembershipScheduleDetailComponent implements OnInit {

  // data source for transfer component
  dataSource: any[];
  listExercisesAndWorkouts: string[];
  isLoadingSpinnerShown: boolean;
  isTransferComponentDisabled: boolean;
  selectedMembershipSchedule: Training;
  selectedCoach: Coach;
  selectedMembership: Membership;
  selectedTrainings: string[];
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

  ngOnInit(): void {
    this.selectedTrainings = [];
    this.dataSource = [];
    this.getSelectedUserProfile();
  }

  // tslint:disable-next-line:no-any
  filterOption(inputValue: string, item: any): boolean {
    console.log(inputValue);
    console.log(item);
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
   * get selected user's profile
   */
  private getSelectedUserProfile(): void {
    this.isLoadingSpinnerShown = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.getSelectedCoach(selectedUserProfile);
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get selected coach
   */
  private getSelectedCoach(selectedUserProfile): void {
    this.isLoadingSpinnerShown = true;
    const coachStatus = 1;
    const getCoachUrl = `${Config.apiBaseUrl}/
    ${Config.apiCoachManagementPrefix}/
    ${Config.apiUsers}/
    ${selectedUserProfile.id}/
    ${Config.apiCoaches}?
    ${Config.statusParameter}=${coachStatus}`;
    this.coachService.getCoach(getCoachUrl)
      .subscribe(selectedCoach => {
        if (selectedCoach) {
          this.selectedCoach = selectedCoach;
          this.getSelectedMembership();
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });

  }

  /**
   * get selected membership
   */
  private getSelectedMembership(): void {
    this.isLoadingSpinnerShown = true;
    this.shareMembershipService.currentMembership
      .subscribe(selectedMembership => {
        if (selectedMembership) {
          this.selectedMembership = selectedMembership;
          this.getSelectedMembershipSchedule();
          this.getDataSourceForTransferComponent();
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get data source for transfer component
   */
  private getDataSourceForTransferComponent(): void {
    this.listExercisesAndWorkouts = [];
    this.loadSingleExercises();
  }

  /**
   * load single exercises
   */
  private loadSingleExercises(): void {
    this.isLoadingSpinnerShown = true;
    this.readLocalJson.getJSON('./assets/workouts.json')
      .subscribe(data => {
        const listRepetitions = [10, 25, 50, 100, 250];
        const exercises = data.exercises;
        exercises.map(eachExercise => {
          for (const eachExerciseRepetition of listRepetitions) {
            this.listExercisesAndWorkouts.push(String(eachExerciseRepetition) + ' x ' + eachExercise.title);
          }
        });
        this.isLoadingSpinnerShown = false;
        this.loadWorkouts();
      });
  }

  /**
   * load workouts
   */
  private loadWorkouts(): void {
    this.isLoadingSpinnerShown = true;
    this.readLocalJson.getJSON('./assets/workouts.json')
      .subscribe(data => {
        const listVolumes = ['1 x ', '2 x ', '3 x '];
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
            for (const eachVolume of listVolumes) {
              this.listExercisesAndWorkouts.push(eachVolume + eachWorkout.title);
            }
          }
        }
        this.isLoadingSpinnerShown = false;
        this.getTrainingsByUserProfileIdAndCoachIdAndTrainingDate();
      });
  }

  private getTrainingsByUserProfileIdAndCoachIdAndTrainingDate(): void {
    this.isLoadingSpinnerShown = true;
    const selectedUserProfileId = this.selectedMembership.userProfile.id;
    const selectedCoachId = this.selectedCoach.id;
    const getTrainingsUrl = `${Config.apiBaseUrl}/
${Config.apiTrainingManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiCoaches}/
${selectedCoachId}?
${Config.trainingDateParameter}=${this.currentDate}`;
    this.trainingService.getTrainings(getTrainingsUrl)
      .subscribe(response => {
        // if (trainings) {
        //   // init data source for transfer component
        //   this.initDataSourceForTransferComponent(trainings);
        // } else {
        //   this.router.navigate(['/client']);
        // }
        console.log(response);
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * init data source for transfer component
   */
  private initDataSourceForTransferComponent(trainings: Training[]): void {
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
  private getSelectedMembershipSchedule(): void {
    // show isLoadingSpinnerShown component
    this.isLoadingSpinnerShown = true;
    this.shareMembershipScheduleService.currentMembershipSchedule
      .subscribe(selectedMembershipSchedule => {
        if (selectedMembershipSchedule) {
          this.selectedMembershipSchedule = selectedMembershipSchedule;
          this.checkTransferComponentIsDisabledOrNot();
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * check transfer component should be isTransferComponentDisabled or not
   */
  private checkTransferComponentIsDisabledOrNot(): void {
    this.currentDate = Utils.getCurrentDate();
    const currentDateObject = new Date(this.currentDate);
    const selectedTrainingDate = this.selectedMembershipSchedule.trainingDate;
    const selectedTrainingDateObject = new Date(selectedTrainingDate);
    this.isTransferComponentDisabled = currentDateObject > selectedTrainingDateObject;
  }

  /**
   * save membership schedule
   */
  private saveMembershipSchedule(): void {
    const listOfTrainings = [];
    for (const eachTrainingTitle of this.selectedTrainings) {
      const training = new Training();
      training.name = eachTrainingTitle;
      training.coach = this.selectedCoach;
      training.userProfile = this.selectedMembership.userProfile;
      training.status = 0;
      training.trainingDate = this.currentDate;
      listOfTrainings.push(training);
    }
    this.addTrainingsToServer(listOfTrainings);
  }

  private addTrainingsToServer(listOfTrainings: Training[]): void {
    this.isLoadingSpinnerShown = true;
    const addTrainingsUrl = `${Config.apiBaseUrl}/${Config.apiTrainingManagementPrefix}/${Config.apiTrainings}`;
    this.trainingService.addTrainings(addTrainingsUrl, listOfTrainings)
      .subscribe(trainings => {
        if (trainings) {
          this.createNotification('success', 'Success', 'Your trainings were submitted successfully');
        } else {
          this.createNotification('error', 'Error', 'Failure to submit your trainings');
        }
        this.isLoadingSpinnerShown = false;
      });
  }
}
