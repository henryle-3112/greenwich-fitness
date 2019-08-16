import {Component, OnInit} from '@angular/core';
import {SingleExercise} from '@gw-models/core';
import {ShareSingleExerciseService} from '@gw-services/core/shared/single-exercise/share-single-exercise.service';
import {Router} from '@angular/router';
import {Config} from '@gw-config/core';

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.component.html',
  styleUrls: ['./exercise-detail.component.css']
})
export class ExerciseDetailComponent implements OnInit {
  selectedSingleExercise: SingleExercise;
  isLoadingSpinnerShown: boolean;
  currentRepetitions: number;
  isChangeRepetitionsModalShown = false;
  radioRepetitionValue: string;

  /**
   *
   * @param shareSingleExercise - inject shareSingleExericse service to get single exercise that user-account want to view detail
   * @param router - inject Router for routing
   */
  constructor(private shareSingleExercise: ShareSingleExerciseService,
              private router: Router) {
  }

  /**
   * init current data
   */
  ngOnInit() {
    this.getSelectedSingleExercise();
  }

  /**
   * get selected single exercise from share single exercise service
   */
  private getSelectedSingleExercise() {
    this.isLoadingSpinnerShown = true;
    this.shareSingleExercise.currentSingleExercise
      .subscribe(selectedSingleExercise => {
        if (selectedSingleExercise) {
          this.selectedSingleExercise = selectedSingleExercise;
          this.isLoadingSpinnerShown = false;
          this.initData();
        } else {
          this.router.navigate(['/client/exercise']);
        }
      });
  }

  /**
   * init current data
   */
  private initData() {
    // get saved instance state, when user go to video component and comeback
    const isUserViewedTutorVideo = localStorage.getItem(Config.checkUserGoToExerciseVideo)
      && localStorage.getItem(Config.checkUserGoToExerciseVideo).localeCompare('true') === 0;
    if (isUserViewedTutorVideo) {
      this.currentRepetitions = Number(localStorage.getItem(Config.currentRepetitions));
      this.radioRepetitionValue = String(this.currentRepetitions);
      localStorage.setItem(Config.checkUserGoToExerciseVideo, 'false');
    } else {
      this.currentRepetitions = 10;
      this.radioRepetitionValue = String(this.currentRepetitions);
      localStorage.setItem(`${Config.currentRepetitions}`, String(this.currentRepetitions));
    }
  }

  /**
   * open change repetitions modal
   */
  public openModalChangeRepetitions() {
    this.isChangeRepetitionsModalShown = true;
  }

  /**
   * handle event when user-account clicked on 'cancel' button on change repetitions modal
   */
  public handleCancelChangeRepetitionsModal() {
    this.isChangeRepetitionsModalShown = false;
  }

  /**
   * handle event when user-account clicked on 'ok' button on change repetitions modal
   */
  public handleConfirmChangeRepetitionsModal() {
    this.isChangeRepetitionsModalShown = false;
    this.currentRepetitions = Number(this.radioRepetitionValue);
    this.radioRepetitionValue = String(this.currentRepetitions);
    localStorage.setItem(Config.currentRepetitions, String(this.currentRepetitions));
  }

  /**
   * go to view exercise video component to view exercise tutorial
   */
  public goToExerciseVideo() {
    localStorage.setItem(Config.checkUserGoToExerciseVideo, 'true');
    this.router.navigate([`/client/exercise/tutorial/${this.selectedSingleExercise.slug}`]);
  }

  /**
   * go to exercise training fragment
   */
  public startTraining() {
    this.router.navigate([`/client/exercise/training/${this.selectedSingleExercise.slug}`]);
  }
}
