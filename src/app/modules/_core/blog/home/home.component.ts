import {Component, HostListener, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {Config} from '@gw-config/core';
import {FacebookAccount, GoogleAccount, PostCategory, PostSlide, UserAccount} from '@gw-models/core';
import {Router} from '@angular/router';
import {ShareMessageService} from '@gw-services/core/shared/message/share-message.service';
import {UserAccountService} from '@gw-services/core/api/user/user-account.service';
import {FacebookAccountService} from '@gw-services/core/api/user/facebook-account.service';
import {AuthenticationService} from '@gw-services/core/authentication/authentication.service';
import {GoogleAccountService} from '@gw-services/core/api/user/google-account.service';
import {ShareUserAccountService} from '@gw-services/core/shared/user-account/share-user-account.service';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {PostSlideService} from '@gw-services/core/api/post/post-slide.service';
import {PostCategoryService} from '@gw-services/core/api/post/post-category.service';
import {SharePostCategoryService} from '@gw-services/core/shared/post-category/share-post-category.service';

@Component({
  selector: 'app-home',
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({opacity: 0}),
        animate(200, style({opacity: 1}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate(200, style({opacity: 0}))
      ])

    ])
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // check when width of the browser changed
  private innerWidth: any;

  // check loading component is showing or not
  loading: boolean;

  // list of post's slides
  postSlides: PostSlide[];

  // list of post's categories
  postCategories: PostCategory[];

  // check dropdown menu is opened or not
  isMenuOpened: boolean;

  // check is search post modal is showing or not
  isSearchPostModalShown: boolean;

  // selected post's category's id (for searching)
  selectedPostCategoryId: number;

  // selected post's category's name (for searching)
  selectedPostName: string;

  // post's category selection
  postCategoriesSelection: PostCategory[];

  // not post's category selection
  notPostCategoriesSelection: PostCategory[];

  // check login type (login by facebook, google or normal account)
  loginType: string;

  /**
   *
   * @param postSlideService - inject postSlideService
   * @param postCategoryService - inject postCategoryService
   * @param sharePostCategoryService - inject sharePostCategoryService
   * @param router - inject router
   * @param shareMessageService - inject shareMessageService
   * @param authentication - inject authentication
   * @param userAccountService - inject userAccountService
   * @param facebookAccountService - inject facebookAccountService
   * @param googleAccountService - inject googleAccountService
   * @param shareUserAccountService - inject shareUserAccountService
   * @param shareUserProfileService - inject shareUserProfileService
   */
  constructor(private postSlideService: PostSlideService,
              private postCategoryService: PostCategoryService,
              private sharePostCategoryService: SharePostCategoryService,
              private router: Router,
              private shareMessageService: ShareMessageService,
              private authentication: AuthenticationService,
              private userAccountService: UserAccountService,
              private facebookAccountService: FacebookAccountService,
              private googleAccountService: GoogleAccountService,
              private shareUserAccountService: ShareUserAccountService,
              private shareUserProfileService: ShareUserProfileService) {
  }

  ngOnInit() {
    // get login type
    this.loginType = localStorage.getItem(Config.loginType);
    // load current user-account's information
    this.loadCurrentUserInformation();
    // init selected post's name (for searching)
    this.selectedPostName = '';
    // init innerWidth to check when window's size changes
    this.innerWidth = window.innerWidth;
    // get all post's categories
    this.getAllPostCategories();
    // get all post's slides
    this.getAllPostSlides();
  }

  /**
   * get all post's slides
   */
  private getAllPostSlides() {
    // show loading component
    this.loading = true;
    // get all post's slides
    this.postSlideService.getAllPostSlides(1)
      .subscribe(postSlides => {
        if (postSlides) {
          this.postSlides = postSlides;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get all post's categories
   */
  private getAllPostCategories() {
    // show loading component
    this.loading = true;
    // get all post's categories
    this.postCategoryService.getAllPostCategories(1)
      .subscribe(postCategories => {
        // get all post's categories
        this.postCategories = postCategories;
        // share to main component
        this.sharePostCategoryService.changePostCategories(postCategories);
        // init post's categories selection
        this.postCategoriesSelection = [];
        // init not post's categories selection
        this.notPostCategoriesSelection = [];
        // get post's categories selection and not post's categories selection
        this.postCategories.map(eachPostCategory => {
          if (eachPostCategory.postCategoryName.localeCompare('Home') !== 0 &&
            eachPostCategory.postCategoryName.localeCompare('Contact') !== 0 &&
            eachPostCategory.postCategoryName.localeCompare('Privacy Policy') !== 0 &&
            eachPostCategory.postCategoryName.localeCompare('About') !== 0) {
            this.postCategoriesSelection.push(eachPostCategory);
          } else {
            this.notPostCategoriesSelection.push(eachPostCategory);
          }
        });
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * go to post's category
   */
  public goToCategory(selectedPostCategory: PostCategory) {
    if (selectedPostCategory.postCategoryName.localeCompare('About') === 0) {
      this.router.navigate(['/blog/about']);
    } else if (selectedPostCategory.postCategoryName.localeCompare('Privacy Policy') === 0) {
      this.router.navigate(['/blog/privacy-policy']);
    } else if (selectedPostCategory.postCategoryName.localeCompare('Contact') === 0) {
      this.router.navigate(['/blog/contact']);
    } else if (selectedPostCategory.postCategoryName.localeCompare('Home') === 0) {
      this.router.navigate([`/blog/home`]);
    } else {
      // share selected post's category
      this.sharePostCategoryService.changePostCategory(selectedPostCategory);
      // go to post's category
      this.router.navigate([`/blog/category/${selectedPostCategory.postCategoryMetaTitle}`]);
    }
  }

  /**
   *
   * @param event - event
   */
  openDropDownMenu(event): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  /**
   *
   * @param event - event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.isMenuOpened = innerWidth > 801;
  }

  /**
   * handle cancel search post modal
   */
  public handleCancelSearchPostModal() {
    this.isSearchPostModalShown = false;
  }

  /**
   * handle confirm search post modal
   */
  public handleConfirmSearchPostModal() {
    // close search post modal
    this.isSearchPostModalShown = false;

    // check post's category is selected or not
    if (typeof this.selectedPostCategoryId !== 'undefined') {
      localStorage.setItem(Config.selectedPostCategoryForSearching, String(this.selectedPostCategoryId));
    }

    // get search's information
    localStorage.setItem(Config.selectedPostNameKeywordsForSearching, this.selectedPostName);

    // go to post search result component
    this.router.navigate(['/blog/search']);

    // share message to tell search post component that get searching posts
    this.shareMessageService.changeMessage('searchPost');
  }

  /**
   * show search blog modal
   */
  public showSearchPostModal() {
    this.isSearchPostModalShown = true;
  }

  /**
   * load current user-account's information
   */
  private loadCurrentUserInformation() {
    // show loading component
    this.loading = true;
    // check login type then load user-account's information
    if (this.loginType.localeCompare('normal') === 0) {
      this.loadNormalAccountInformation();
    } else if (this.loginType.localeCompare('facebook') === 0) {
      this.loadFacebookAccountInformation();
    } else if (this.loginType.localeCompare('google') === 0) {
      this.loadGoogleAccountInformation();
    }
  }

  /**
   * load normal account information
   */
  private loadNormalAccountInformation() {
    // get current user-account's name
    const authenticatedUserName = this.authentication.currentUserValue.userName;
    // load user-account's information by user-account's name (load user-account's account and user-account's profile)
    const getUserAccountByUsernameUrl = `${Config.api}/${Config.apiGetUserAccountByUserName}${authenticatedUserName}`;
    // get user-account's account information
    this.userAccountService.getUserAccountByUsername(getUserAccountByUsernameUrl)
      .subscribe((userAccount: UserAccount) => {
        this.shareUserAccountService.changeUserAccount(userAccount);
        this.shareUserProfileService.changeUserProfile(userAccount.userProfile);
        this.loading = false;
      });
  }

  /**
   * load facebook account information
   */
  private loadFacebookAccountInformation() {
    // get facebook's id
    const selectedFacebookId = localStorage.getItem(Config.facebookId);
    // load user-account's information by facebookId
    this.facebookAccountService.getFacebookAccountByFacebookId(selectedFacebookId)
      .subscribe((facebookAccount: FacebookAccount) => {
        this.shareUserProfileService.changeUserProfile(facebookAccount.userProfile);
        this.loading = false;
      });
  }

  /**
   * load google acccount information
   */
  private loadGoogleAccountInformation() {
    // get google's id
    const selectedGoogleId = localStorage.getItem(Config.googleId);
    // load user-account's information by googleId
    this.googleAccountService.getGoogleAccountByGoogleId(selectedGoogleId)
      .subscribe((googleAccount: GoogleAccount) => {
        this.shareUserProfileService.changeUserProfile(googleAccount.userProfile);
        this.loading = false;
      });
  }
}
