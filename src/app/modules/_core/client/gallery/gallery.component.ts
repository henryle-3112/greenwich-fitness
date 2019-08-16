import {OnInit, Component} from '@angular/core';
import {Gallery} from '@gw-models/core';
import {GalleryService} from '@gw-services/core/api/gallery/gallery.service';
import {Config} from '@gw-config/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  galleries: Gallery[];
  currentGalleriesPage: number;
  isLoadingSpinnerShown = true;
  galleryTitleKeywords: string;
  nGalleryPerPage: number;
  totalGalleries: number;

  /**
   *
   * @param galleryService - inject gallery service to interact with gallery's data
   */
  constructor(private galleryService: GalleryService) {
  }

  /**
   * init data
   */
  ngOnInit(): void {
    this.nGalleryPerPage = Config.numberItemsPerPage;
    this.galleryTitleKeywords = '';
    this.currentGalleriesPage = Config.currentPage;
    this.getGalleries();
  }

  /**
   * get galleries by current's page
   */
  private getGalleries(): void {
    const galleryStatus = 1;
    let getGalleriesUrl = `${Config.apiBaseUrl}/
${Config.apiGalleryManagementPrefix}/
${Config.apiGalleries}?
${Config.statusParameter}=${galleryStatus}&
${Config.pageParameter}=${this.currentGalleriesPage}`;
    if (this.galleryTitleKeywords.localeCompare('') !== 0) {
      getGalleriesUrl += `&${Config.searchParameter}=${this.galleryTitleKeywords.toLowerCase()}`;
    }
    this.isLoadingSpinnerShown = true;
    this.galleryService.getGalleries(getGalleriesUrl)
      .subscribe(response => {
        this.galleries = response.body;
        this.totalGalleries = Number(response.headers.get(Config.headerXTotalCount));
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param event - selected page
   */
  public galleryPageChange(event): void {
    this.currentGalleriesPage = event;
    this.getGalleries();
  }

  /**
   *
   * @param keyword - keyword that user-account type on the search box
   */
  public searchGallery(keyword): void {
    this.galleryTitleKeywords = keyword;
    this.currentGalleriesPage = 1;
    this.getGalleries();
  }
}
