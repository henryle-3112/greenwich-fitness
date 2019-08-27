import { Component, OnInit } from '@angular/core';
import { ReadLocalJsonService } from '@gw-services/core/api/read-local-json/read-local-json.service';
import { Utils } from '@gw-helpers/core';
import { Coach, Membership, Training } from '@gw-models/core';
import { TrainingService } from '@gw-services/core/api/training/training.service';
import { ShareUserProfileService } from '@gw-services/core/shared/user-profile/share-user-profile.service';
import { Router } from '@angular/router';
import { ShareMembershipService } from '@gw-services/core/shared/membership/share-membership.service';
import { CoachService } from '@gw-services/core/api/coach/coach.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Config } from '@gw-config/core';

@Component({
  selector: 'app-add-membership-schedule',
  templateUrl: './add-membership-schedule.component.html',
  styleUrls: ['./add-membership-schedule.component.css']
})
export class AddMembershipScheduleComponent implements OnInit {
  // data source for transfer component
  dataSource: any[];
  listExercisesAndWorkouts: string[];
  isLoadingSpinnerShown: boolean;
  currentDate: string;
  selectedMembership: Membership;
  selectedCoach: Coach;
  selectedTrainings: string[];

  /**
   *
   * @param readLocalJson - inject readLocalJson
   * @param shareUserProfileService - inject shareUserProfileService
   * @param shareMembershipService - inject shareMembershipService
   * @param coachService - inject coachService
   * @param notification - inject notification
   * @param router - inject router
   * @param trainingService - inject trainingService
   */
  constructor(private readLocalJson: ReadLocalJsonService,
    private shareUserProfileService: ShareUserProfileService,
    private shareMembershipService: ShareMembershipService,
    private coachService: CoachService,
    private notification: NzNotificationService,
    private router: Router,
    private trainingService: TrainingService
  ) {
  }

  ngOnInit(): void {
    this.selectedTrainings = [];
    this.currentDate = Utils.getCurrentDate();
    this.dataSource = [];
    this.getSelectedUserProfile();
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
      });
    // hide isLoadingSpinnerShown component
    this.isLoadingSpinnerShown = false;
  }

  /**
   * get selected coach
   */
  private getSelectedCoach(selectedUserProfile): void {
    this.isLoadingSpinnerShown = true;
    const coachStatus = 1;
    const selectedUserProfileId = selectedUserProfile.id;
    const getCoachUrl = `${Config.apiBaseUrl}/
${Config.apiCoachManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
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
    // show isLoadingSpinnerShown component
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
    const getTrainingUrl = `${Config.apiBaseUrl}/
${Config.apiTrainingManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiCoaches}/
${selectedCoachId}?
${Config.trainingDateParameter}=${this.currentDate}`;
    this.trainingService.getTrainings(getTrainingUrl)
      .subscribe(response => {
        if (response) {
          this.initDataSourceForTransferComponent(response.body);
        } else {
          this.router.navigate(['/client']);
        }
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
      if (isTrainingExisted) {
        this.selectedTrainings.push(this.listExercisesAndWorkouts[i]);
      }
    }
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
   * save membership schedule
   */
  public saveMembershipSchedule(): void {
    const listOfTrainings = [];
    for (const eachTrainingTitle of this.selectedTrainings) {
      const training = new Training();
      training.name = eachTrainingTitle;
      training.coach = this.selectedCoach;
      training.userProfile = this.selectedMembership.userProfile;
      training.status = -1;
      training.trainingDate = this.currentDate;
      listOfTrainings.push(training);
    }
    this.addTrainingsToServer(listOfTrainings);
  }

  /**
   *
   * @param listOfTrainings - list of trainings that will be added to membership
   */
  private addTrainingsToServer(listOfTrainings: Training[]): void {
    this.isLoadingSpinnerShown = true;
    const addTrainingUrl = `${Config.apiBaseUrl}/${Config.apiTrainingManagementPrefix}/${Config.apiTrainings}`;
    this.trainingService.addTrainings(addTrainingUrl, listOfTrainings)
      .subscribe(trainings => {
        if (trainings) {
          this.createNotification('success', 'Success', 'Your trainings were submitted successfully');
        } else {
          this.createNotification('error', 'Error', 'Failure to submit your trainings');
        }
        this.isLoadingSpinnerShown = false;
      });
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

}
