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

  // selected single exercise that user-account want to view detail
  // get from ShareSingleExerciseService
  selectedSingleExercise: SingleExercise;

  // check loading component is showing or not
  loading: boolean;

  // number of repetitions that user-account want to do
  currentRepetitions: number;

  // check change exercise's repetitions modal is showing or not
  isChangeRepetitionsModalShown = false;

  // radio repetitions value of change exercise's repetitions modal
  radioRepetitionValue: string;

  /**
   *
   * @param shareSingleExercise - inject shareSingleExericse service to get single exercise that user-account want to view detail
   * @param route - inject Router for routing
   */
  constructor(private shareSingleExercise: ShareSingleExerciseService,
              private route: Router) {
  }

  /**
   * init current data
   */
  ngOnInit() {
    // get selected single exercise
    this.getSelectedSingleExercise();
  }

  /**
   * get selected single exercise from share single exercise service
   */
  private getSelectedSingleExercise() {
    // show loading component
    this.loading = true;
    // get selected single exercise from share single exercise service
    this.shareSingleExercise
      .currentSingleExercise.subscribe(selectedSingleExercise => {
      // get selected single exericse
      this.selectedSingleExercise = selectedSingleExercise;
      // hide loading component
      this.loading = false;
      // check selected single exercise existed or not
      // if selected single exercise not existed - redirect to list of single exercises
      this.checkSelectedSingleExerciseExistedOrNot();
      // init data
      this.initData();
    });
  }

  /**
   * check selected single exericis existed or not
   * if not, redirect to list of single exercises and let user-account choose again
   */
  private checkSelectedSingleExerciseExistedOrNot() {
    if (this.selectedSingleExercise == null) {
      this.route.navigate(['/client/exercise']);
    }
  }

  /**
   * init current data
   */
  private initData() {
    if (localStorage.getItem(Config.checkUserGoToExerciseVideo)
      && localStorage.getItem(Config.checkUserGoToExerciseVideo).localeCompare('true') === 0) {
      this.currentRepetitions = Number(localStorage.getItem(Config.currentRepetitions));
      this.radioRepetitionValue = String(this.currentRepetitions);
      // change state of check user go to exercise video
      localStorage.setItem(Config.checkUserGoToExerciseVideo, 'false');
    } else {
      // init current repetitions
      this.currentRepetitions = 10;
      // init current radio value of change exericse's repetitions modal
      this.radioRepetitionValue = String(this.currentRepetitions);
      // reset current repetitions by saving to localStorage for each single exercise
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
    // change current repetitions
    this.currentRepetitions = +this.radioRepetitionValue;
    this.radioRepetitionValue = String(this.currentRepetitions);
    // save current repetitions
    localStorage.setItem(Config.currentRepetitions, String(this.currentRepetitions));
  }

  /**
   * go to view exercise video component to view exercise tutorial
   */
  public goToExerciseVideo() {
    // set checkUserGoToExerciseVideo
    localStorage.setItem(Config.checkUserGoToExerciseVideo, 'true');
    // go to exercise video component
    this.route.navigate([`/client/exercise/tutorial/${this.selectedSingleExercise.slug}`]);
  }

  /**
   * go to exercise training fragment
   */
  public startTraining() {
    // start training single exercise
    this.route.navigate([`/client/exercise/training/${this.selectedSingleExercise.slug}`]);
  }
}
