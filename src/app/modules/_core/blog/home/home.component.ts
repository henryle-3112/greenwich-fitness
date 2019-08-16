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
  browserInnerWidth: any;
  isLoadingSpinnerShown: boolean;
  postSlides: PostSlide[];
  postCategories: PostCategory[];
  isDropDownMenuOpened: boolean;
  isSearchPostModalShown: boolean;
  selectedPostCategoryForSearching: number;
  selectedPostNameForSearching: string;
  postCategoriesSelection: PostCategory[];
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

  ngOnInit(): void {
    this.loginType = localStorage.getItem(Config.loginType);
    this.loadCurrentUserInformation();
    this.selectedPostNameForSearching = '';
    this.browserInnerWidth = window.innerWidth;
    this.getAllPostCategories();
    this.getAllPostSlides();
  }

  /**
   * get all post's slides
   */
  private getAllPostSlides(): void {
    this.isLoadingSpinnerShown = true;
    const postSlideStatus = 1;
    const getPostSlidesUrl = `${Config.apiBaseUrl}/
${Config.apiPostManagementPrefix}/
${Config.apiPostSlides}?
${Config.statusParameter}=${postSlideStatus}`;
    this.postSlideService.getPostSlides(getPostSlidesUrl)
      .subscribe(postSlides => {
        if (postSlides) {
          this.postSlides = postSlides;
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get all post's categories
   */
  private getAllPostCategories(): void {
    this.isLoadingSpinnerShown = true;
    const postCategoryStatus = 1;
    const getPostCategoriesUrl = `${Config.apiBaseUrl}/
${Config.apiPostManagementPrefix}/
${Config.apiPostCategories}?
${Config.statusParameter}=${postCategoryStatus}`;
    this.postCategoryService.getPostCategories(getPostCategoriesUrl)
      .subscribe(postCategories => {
        this.postCategories = postCategories;
        this.sharePostCategoryService.changePostCategories(postCategories);
        this.postCategoriesSelection = [];
        this.notPostCategoriesSelection = [];
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
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * go to post's category
   */
  public goToCategory(selectedPostCategory: PostCategory): void {
    if (selectedPostCategory.postCategoryName.localeCompare('About') === 0) {
      this.router.navigate(['/blog/about']);
    } else if (selectedPostCategory.postCategoryName.localeCompare('Privacy Policy') === 0) {
      this.router.navigate(['/blog/privacy-policy']);
    } else if (selectedPostCategory.postCategoryName.localeCompare('Contact') === 0) {
      this.router.navigate(['/blog/contact']);
    } else if (selectedPostCategory.postCategoryName.localeCompare('Home') === 0) {
      this.router.navigate([`/blog/home`]);
    } else {
      this.sharePostCategoryService.changePostCategory(selectedPostCategory);
      this.router.navigate([`/blog/category/${selectedPostCategory.postCategoryMetaTitle}`]);
    }
  }

  /**
   *
   * @param event - event
   */
  openDropDownMenu(event): void {
    this.isDropDownMenuOpened = !this.isDropDownMenuOpened;
  }

  /**
   *
   * @param event - event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.browserInnerWidth = window.innerWidth;
    this.isDropDownMenuOpened = this.browserInnerWidth > 801;
  }

  /**
   * handle cancel search post modal
   */
  public handleCancelSearchPostModal(): void {
    this.isSearchPostModalShown = false;
  }

  /**
   * handle confirm search post modal
   */
  public handleConfirmSearchPostModal(): void {
    this.isSearchPostModalShown = false;
    if (typeof this.selectedPostCategoryForSearching !== 'undefined') {
      localStorage.setItem(Config.selectedPostCategoryForSearching, String(this.selectedPostCategoryForSearching));
    }
    localStorage.setItem(Config.selectedPostNameKeywordsForSearching, this.selectedPostNameForSearching);
    this.router.navigate(['/blog/search']);
    this.shareMessageService.changeMessage('searchPost');
  }

  /**
   * show search blog modal
   */
  public showSearchPostModal(): void {
    this.isSearchPostModalShown = true;
  }

  /**
   * load current user-account's information
   */
  private loadCurrentUserInformation(): void {
    this.isLoadingSpinnerShown = true;
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
  private loadNormalAccountInformation(): void {
    const authenticatedUserName = this.authentication.currentUserValue.userName;
    const getUserAccountUrl = `${Config.apiBaseUrl}/
${Config.apiUserManagementPrefix}/
${Config.apiUserAccounts}?
${Config.userNameParameter}=${authenticatedUserName}`;
    this.userAccountService.getUserAccount(getUserAccountUrl)
      .subscribe((userAccount: UserAccount) => {
        this.shareUserAccountService.changeUserAccount(userAccount);
        this.shareUserProfileService.changeUserProfile(userAccount.userProfile);
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * load facebook account information
   */
  private loadFacebookAccountInformation(): void {
    const selectedFacebookId = localStorage.getItem(Config.facebookId);
    const getFacebookAccountUrl = `${Config.apiBaseUrl}/
${Config.apiUserManagementPrefix}/
${Config.apiFacebookAccount}/
${selectedFacebookId}`;
    this.facebookAccountService.getFacebookAccount(getFacebookAccountUrl)
      .subscribe((facebookAccount: FacebookAccount) => {
        this.shareUserProfileService.changeUserProfile(facebookAccount.userProfile);
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * load google acccount information
   */
  private loadGoogleAccountInformation(): void {
    const selectedGoogleId = localStorage.getItem(Config.googleId);
    const getGoogleAccountUrl = `${Config.apiBaseUrl}/${Config.apiUserManagementPrefix}/${Config.apiGoogleAccount}/${selectedGoogleId}`;
    this.googleAccountService.getGoogleAccount(getGoogleAccountUrl)
      .subscribe((googleAccount: GoogleAccount) => {
        this.shareUserProfileService.changeUserProfile(googleAccount.userProfile);
        this.isLoadingSpinnerShown = false;
      });
  }
}
