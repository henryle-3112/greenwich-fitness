import {Component, HostListener, OnInit} from '@angular/core';
import {ProductSlideService} from '@gw-services/core/api/product/product-slide.service';
import {FacebookAccount, GoogleAccount, ProductCategory, ProductSlide, UserAccount} from '@gw-models/core';
import {ProductCategoryService} from '@gw-services/core/api/product/product-category.service';
import {ShareProductCategoryService} from '@gw-services/core/shared/product-category/share-product-category.service';
import {Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {Config} from '@gw-config/core';
import {ShareMessageService} from '@gw-services/core/shared/message/share-message.service';
import {AuthenticationService} from '@gw-services/core/authentication/authentication.service';
import {UserAccountService} from '@gw-services/core/api/user/user-account.service';
import {FacebookAccountService} from '@gw-services/core/api/user/facebook-account.service';
import {GoogleAccountService} from '@gw-services/core/api/user/google-account.service';
import {ShareUserAccountService} from '@gw-services/core/shared/user-account/share-user-account.service';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';

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
  productSlides: ProductSlide[];
  productCategories: ProductCategory[];
  isDropDownMenuOpened: boolean;
  isSearchProductModalShown: boolean;
  selectedProductCategoryForSearching: number;
  selectedProductPriceRangeForSearching: any;
  selectedProductNameForSearching: string;
  productCategoriesSelection: ProductCategory[];
  notProductCategoriesSelection: ProductCategory[];
  // check login type (login by facebook, google or normal account)
  loginType: string;

  /**
   *
   * @param productSlideService - inject productSlideService
   * @param productCategoryService - inject productCategoryService
   * @param shareProductCategoryService - inject shareProductCategoryService
   * @param router - inject router
   * @param shareMessageService - inject shareMessageService
   * @param authentication - inject authentication
   * @param userAccountService - inject userAccountService
   * @param facebookAccountService - inject facebookAccountService
   * @param googleAccountService - inject googleAccountService
   * @param shareUserAccountService - inject shareUserAccountService
   * @param shareUserProfileService - inject shareUserProfileService
   */
  constructor(private productSlideService: ProductSlideService,
              private productCategoryService: ProductCategoryService,
              private shareProductCategoryService: ShareProductCategoryService,
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
    this.selectedProductPriceRangeForSearching = [0, 50];
    this.selectedProductNameForSearching = '';
    this.browserInnerWidth = window.innerWidth;
    this.getAllProductCategories();
    this.getAllProductSlides();
  }

  /**
   * get all product's slides
   */
  private getAllProductSlides(): void {
    this.isLoadingSpinnerShown = true;
    const productSlideStatus = 1;
    const productSlidesUrl = `${Config.apiBaseUrl}/
${Config.apiProductManagementPrefix}/
${Config.apiProductSlides}?${Config.statusParameter}=${productSlideStatus}`;
    this.productSlideService.getProductSlides(productSlidesUrl)
      .subscribe(productSlides => {
        this.productSlides = productSlides;
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get all product's categories
   */
  private getAllProductCategories(): void {
    this.isLoadingSpinnerShown = true;
    const productCategoryStatus = 1;
    const getProductCategoriesUrl = `${Config.apiBaseUrl}/
${Config.apiProductManagementPrefix}/
${Config.apiProductCategories}?
${Config.statusParameter}=${productCategoryStatus}`;
    this.productCategoryService.getProductCategories(getProductCategoriesUrl)
      .subscribe(productCategories => {
        this.productCategories = productCategories;
        this.shareProductCategoryService.changeProductCategories(productCategories);
        this.productCategoriesSelection = [];
        this.notProductCategoriesSelection = [];
        this.productCategories.map(eachProductCategory => {
          if (eachProductCategory.productCategoryName.localeCompare('Home') !== 0 &&
            eachProductCategory.productCategoryName.localeCompare('Contact') !== 0 &&
            eachProductCategory.productCategoryName.localeCompare('Privacy Policy') !== 0 &&
            eachProductCategory.productCategoryName.localeCompare('About') !== 0) {
            this.productCategoriesSelection.push(eachProductCategory);
          } else {
            this.notProductCategoriesSelection.push(eachProductCategory);
          }
        });
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param selectedProductCategory - product's category that user want to view
   */
  public goToCategory(selectedProductCategory: ProductCategory): void {
    if (selectedProductCategory.productCategoryName.localeCompare('About') === 0) {
      this.router.navigate(['/shop/about']);
    } else if (selectedProductCategory.productCategoryName.localeCompare('Privacy Policy') === 0) {
      this.router.navigate(['/shop/privacy-policy']);
    } else if (selectedProductCategory.productCategoryName.localeCompare('Contact') === 0) {
      this.router.navigate(['/shop/contact']);
    } else if (selectedProductCategory.productCategoryName.localeCompare('Home') === 0) {
      this.router.navigate([`/shop/home`]);
    } else if (selectedProductCategory.productCategoryName.localeCompare('Feed') === 0) {
      this.router.navigate(['/client/feed']);
    } else {
      this.shareProductCategoryService.changeProductCategory(selectedProductCategory);
      this.router.navigate([`/shop/category/${selectedProductCategory.productCategoryMetaTitle}`]);
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
   * handle cancel search product modal
   */
  public handleCancelSearchProductModal(): void {
    this.isSearchProductModalShown = false;
  }

  /**
   * handle confirm search product modal
   */
  public handleConfirmSearchProductModal(): void {
    this.isSearchProductModalShown = false;
    if (typeof this.selectedProductCategoryForSearching !== 'undefined') {
      localStorage.setItem(Config.selectedProductCategoryForSearching, String(this.selectedProductCategoryForSearching));
    }
    localStorage.setItem(Config.selectedProductMinPriceForSearching, String(this.selectedProductPriceRangeForSearching[0]));
    localStorage.setItem(Config.selectedProductMaxPriceForSearching, String(this.selectedProductPriceRangeForSearching[1]));
    localStorage.setItem(Config.selectedProductNameKeywordsForSearching, this.selectedProductNameForSearching);
    this.router.navigate(['/shop/search']);
    // share message to tell search product component that get searching products
    this.shareMessageService.changeMessage('searchProduct');
  }

  /**
   * show search product modal
   */
  public showSearchProductModal(): void {
    this.isSearchProductModalShown = true;
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
   * load google account information
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

  /**
   * go to shopping cart
   */
  public goToShoppingCart(): void {
    this.router.navigate(['/shop/cart']);
  }
}
