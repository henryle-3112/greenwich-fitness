import {Component, OnInit} from '@angular/core';
import {ReadLocalJsonService} from '@gw-services/core/api/read-local-json/read-local-json.service';
import {SingleExercise} from '@gw-models/core';
import {Router} from '@angular/router';
import {ShareSingleExerciseService} from '@gw-services/core/shared/single-exercise/share-single-exercise.service';

@Component({
  selector: 'app-single-exercise',
  templateUrl: './single-exercise.component.html',
  styleUrls: ['./single-exercise.component.css']
})
export class SingleExerciseComponent implements OnInit {
  // all single exercises data
  singleExercises: SingleExercise[];
  // single exercises data per page
  singleExercisesPerPage: SingleExercise[];
  // need to create single exercises temp to load data base on current page and keywords
  singleExercisesTemp: SingleExercise[];
  // currentPage
  currentPage = 1;
  // loading component is show ot not
  loading = true;
  // search value - return exercises and change pagination based on keywords
  searchValue: string;
  // number of single exercise per page
  nSingleExercisesPerPage: number;
  // total exercises;
  totalExercises: number;
  // startIndex to get single exercises per page
  startIndex: number;

  /**
   *
   * @param readLocalJson - inject read local json service to load local json
   * @param shareSingleExercise - inject share single exercise service to set selected single exercise to pass other component
   * @param router - inject Router for routing
   */
  constructor(private readLocalJson: ReadLocalJsonService,
              private shareSingleExercise: ShareSingleExerciseService,
              private router: Router) {
  }

  /**
   * init data
   */
  ngOnInit() {
    // init searchValue
    this.searchValue = '';
    // init number exercises per page
    this.nSingleExercisesPerPage = 8;
    // load single exercises
    this.loadSingExercises();
  }

  /**
   * load single exercises
   */
  private loadSingExercises() {
    // load local json
    this.readLocalJson.getJSON('./assets/workouts.json')
      .subscribe(data => {
        // init single exercises
        this.singleExercises = [];
        // get single exericses
        const exercises = data.exercises;
        // read exercises
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
        // assign all data to single exercises temp the first time
        this.singleExercisesTemp = this.singleExercises;
        // calculate current total exercises
        this.totalExercises = this.singleExercisesTemp.length;
        // load single exercises per page
        this.loadSingleExercisesPerPage();
      });
  }

  /**
   *
   * @param event - current page
   */
  public exercisePageChange(event) {
    // change current page
    this.currentPage = event;
    // show loading
    this.loading = true;
    // reload data based on keywords
    this.reloadSingleExercisesTemp();
    // load data for new page
    this.loadSingleExercisesPerPage();
  }

  /**
   *
   * @param keyword - keyword to search data
   */
  public searchExercise(keyword) {
    // reset current page
    this.currentPage = 1;
    // change search value
    this.searchValue = keyword;
    // reload data based on keywords
    this.reloadSingleExercisesTemp();
    // load data for new page
    this.loadSingleExercisesPerPage();
  }

  /**
   * load single exercises per page
   */
  private loadSingleExercisesPerPage() {
    // init startIndex
    this.startIndex = ((this.currentPage - 1) * 8) + 1;
    // get single exercises data per page
    this.singleExercisesPerPage = this.singleExercisesTemp.slice(this.startIndex - 1, this.startIndex + 7);
    this.loading = false;
  }

  /**
   * reload single exercises temp based on keywords
   */
  private reloadSingleExercisesTemp() {
    // if search value is equal to '', get all single exercises
    if (this.searchValue.localeCompare('') === 0) {
      this.singleExercisesTemp = this.singleExercises;
    } else {
      // assign single exericses temp is empty
      this.singleExercisesTemp = [];
      // push each single exercise to exercises temp based on keywords
      this.singleExercises.map(eachSingleExercise => {
        if (eachSingleExercise.title.includes(this.searchValue)) {
          this.singleExercisesTemp.push(eachSingleExercise);
        }
      });
    }
    // calculate current total exercises
    this.totalExercises = this.singleExercisesTemp.length;
  }

  /**
   *
   * @param selectedSingleExercise - set selected single exercise and use share single exercise service to pass to other components
   */
  public goToExerciseDetail(selectedSingleExercise) {
    // pass selected single exercise to exercise detail component
    this.shareSingleExercise.changeSingleExercise(selectedSingleExercise);
    // go to exercise detail component
    const exerciseDetailUrl = `/client/exercise/${selectedSingleExercise.slug}`;
    this.router.navigate([exerciseDetailUrl]);
  }
}
