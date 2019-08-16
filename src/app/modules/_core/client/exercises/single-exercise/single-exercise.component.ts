import {Component, OnInit} from '@angular/core';
import {ReadLocalJsonService} from '@gw-services/core/api/read-local-json/read-local-json.service';
import {SingleExercise} from '@gw-models/core';
import {Router} from '@angular/router';
import {ShareSingleExerciseService} from '@gw-services/core/shared/single-exercise/share-single-exercise.service';
import {Config} from '@gw-config/core';

@Component({
  selector: 'app-single-exercise',
  templateUrl: './single-exercise.component.html',
  styleUrls: ['./single-exercise.component.css']
})
export class SingleExerciseComponent implements OnInit {
  singleExercises: SingleExercise[];
  singleExercisesPerPage: SingleExercise[];
  singleExercisesTemp: SingleExercise[];
  currentSingleExercisesPage = 1;
  isLoadingSpinnerShown = true;
  singleExerciseTitleKeywords: string;
  nSingleExercisesPerPage: number;
  totalSingleExercises: number;

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
  ngOnInit(): void {
    this.singleExerciseTitleKeywords = '';
    this.nSingleExercisesPerPage = Config.numberItemsPerPage;
    this.loadSingExercises();
  }

  /**
   * load single exercises
   */
  private loadSingExercises(): void {
    this.readLocalJson.getJSON('./assets/workouts.json')
      .subscribe(data => {
        this.singleExercises = [];
        const exercises = data.exercises;
        exercises.map(eachExercise => {
          const eachSingleExercise = this.createSingleExerciseFromJsonObject(eachExercise);
          this.singleExercises.push(eachSingleExercise);
        });
        this.singleExercisesTemp = this.singleExercises;
        this.totalSingleExercises = this.singleExercisesTemp.length;
        this.getSingleExercisesPerPage();
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
   * @param event - current page
   */
  public exercisePageChange(event): void {
    this.currentSingleExercisesPage = event;
    this.isLoadingSpinnerShown = true;
    this.reloadSingleExercisesTemp();
    this.getSingleExercisesPerPage();
  }

  /**
   *
   * @param keyword - keyword to search data
   */
  public searchExercise(keyword): void {
    this.currentSingleExercisesPage = 1;
    this.singleExerciseTitleKeywords = keyword;
    this.reloadSingleExercisesTemp();
    this.getSingleExercisesPerPage();
  }

  /**
   * load single exercises per page
   */
  private getSingleExercisesPerPage(): void {
    const startIndex = ((this.currentSingleExercisesPage - 1) * 8) + 1;
    this.singleExercisesPerPage = this.singleExercisesTemp.slice(startIndex - 1, startIndex + 7);
    this.isLoadingSpinnerShown = false;
  }

  /**
   * reload single exercises temp based on keywords
   */
  private reloadSingleExercisesTemp(): void {
    if (this.singleExerciseTitleKeywords.localeCompare('') === 0) {
      this.singleExercisesTemp = this.singleExercises;
    } else {
      this.singleExercisesTemp = [];
      this.singleExercises.map(eachSingleExercise => {
        if (eachSingleExercise.title.includes(this.singleExerciseTitleKeywords)) {
          this.singleExercisesTemp.push(eachSingleExercise);
        }
      });
    }
    this.totalSingleExercises = this.singleExercisesTemp.length;
  }

  /**
   *
   * @param selectedSingleExercise - set selected single exercise and use share single exercise service to pass to other components
   */
  public goToExerciseDetail(selectedSingleExercise): void {
    // pass selected single exercise to exercise detail component
    this.shareSingleExercise.changeSingleExercise(selectedSingleExercise);
    const exerciseDetailUrl = `/client/exercise/${selectedSingleExercise.slug}`;
    this.router.navigate([exerciseDetailUrl]);
  }
}
