import {OnInit, Component} from '@angular/core';
import {Gallery, ResponseMessage} from '@gw-models/core';
import {GalleryService} from '@gw-services/core/api/gallery/gallery.service';
import {Config} from '@gw-config/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {

  // list of galleries
  galleries: Gallery[];

  // currentPage
  currentPage = 1;

  // loading component is show ot not
  loading = true;

  // search value - return galleries and change pagination based on keywords
  searchValue: string;

  // number gallery per page
  nGalleryPerPage: number;

  // total gallery
  totalGallery: number;

  /**
   *
   * @param galleryService - inject gallery service to interact with gallery's data
   */
  constructor(private galleryService: GalleryService) {
  }

  /**
   * init data
   */
  ngOnInit() {
    // init number of galleries per page
    this.nGalleryPerPage = 8;
    // init current search value
    this.searchValue = '';
    // get total number of galleries
    this.getNumberOfGalleries();
    // get galleries by page
    this.getGalleriesByPage();
  }

  /**
   * get galleries by current's page
   */
  private getGalleriesByPage() {
    // create url to get galleriea by current page
    let currentGetGalleriesByPageUrl = `${Config.api}/${Config.apiGetGalleriesByPage}/${this.currentPage}`;
    // if search value is not equal to '', then include keywords to the url
    if (this.searchValue.localeCompare('') !== 0) {
      currentGetGalleriesByPageUrl += `?keyword=${this.searchValue.toLowerCase()}`;
    }
    // show loading component
    this.loading = true;
    // get galleries by page and keywords (if existed)
    this.galleryService.getGalleriesByPage(currentGetGalleriesByPageUrl)
      .subscribe((response: Gallery[]) => {
        if (response) {
          this.galleries = [];
          // assign data to galleries
          this.galleries = response;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   *
   * @param event - selected page
   */
  public galleryPageChange(event) {
    // get current's page
    this.currentPage = event;
    // get galleries by page
    this.getGalleriesByPage();
  }

  /**
   *
   * @param keyword - keyword that user-account type on the search box
   */
  public searchGallery(keyword) {
    // set current search keyword - user-account search galleries by name and change pagination based on keyword
    this.searchValue = keyword;
    // reset current page
    this.currentPage = 1;
    // change pagination
    this.getNumberOfGalleries();
    this.getGalleriesByPage();
  }

  /**
   * get total number of galleries
   */
  private getNumberOfGalleries() {
    // create url to get total number of galleries
    let currentGetNumberOfGalleryUrl = `${Config.api}/${Config.apiGetNumberOfGalleries}`;
    // if search value is not equal to '', then include keywords to the url
    if (this.searchValue.localeCompare('') !== 0) {
      currentGetNumberOfGalleryUrl += `?keyword=${this.searchValue.toLowerCase()}`;
    }
    // showing loading component
    this.loading = true;
    // get total number of galleries
    this.galleryService.getTotalGalleries(currentGetNumberOfGalleryUrl)
      .subscribe((responseMessage: ResponseMessage) => {
        if (responseMessage) {
          // assign total number of galleries to totalGallery
          this.totalGallery = Number(responseMessage.message);
        }
      });
  }
}
