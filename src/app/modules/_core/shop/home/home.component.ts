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
  // check when width of the browser changed
  private innerWidth: any;

  // check loading component is showing or not
  loading: boolean;

  // list of product's slides
  productSlides: ProductSlide[];

  // list of product's categories
  productCategories: ProductCategory[];

  // check dropdown menu is opened or not
  isMenuOpened: boolean;

  // check is search product modal is showing or not
  isSearchProductModalShown: boolean;

  // selected product's category's id (for searching)
  selectedProductCategoryId: number;

  // selected product's price (for searching)
  selectedProductPrice: any;

  // selected product's name (for searching)
  selectedPostName: string;

  // product's category selection
  productCategoriesSelection: ProductCategory[];

  // not product's category selection
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

  ngOnInit() {
    // get login type
    this.loginType = localStorage.getItem(Config.loginType);
    // load current user-account's information
    this.loadCurrentUserInformation();
    // init selected product price (for searching)
    this.selectedProductPrice = [0, 50];
    // init selected product's name (for searching)
    this.selectedPostName = '';
    // init innerWidth to check when window's size changes
    this.innerWidth = window.innerWidth;
    // get all product's categories
    this.getAllProductCategories();
    // get all product's slides
    this.getAllProductSlides();
  }

  /**
   * get all product's slides
   */
  private getAllProductSlides() {
    // show loading component
    this.loading = true;
    // get all product's slides
    this.productSlideService.getAllProductSlides(1)
      .subscribe(productSlides => {
        this.productSlides = productSlides;
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get all product's categories
   */
  private getAllProductCategories() {
    // show loading component
    this.loading = true;
    // get all product's categories
    this.productCategoryService.getAllProductCategories(1)
      .subscribe(productCategories => {
        // get all products categories
        this.productCategories = productCategories;
        // share to main component
        this.shareProductCategoryService.changeProductCategories(productCategories);
        // init product's categories selection
        this.productCategoriesSelection = [];
        // init not product's categories selection
        this.notProductCategoriesSelection = [];
        // get product's categories selection and not product's categories selection
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
        console.log(this.selectedProductCategoryId);
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * go to product's category
   */
  public goToCategory(selectedProductCategory: ProductCategory) {
    if (selectedProductCategory.productCategoryName.localeCompare('About') === 0) {
      this.router.navigate(['/shop/about']);
    } else if (selectedProductCategory.productCategoryName.localeCompare('Privacy Policy') === 0) {
      this.router.navigate(['/shop/privacy-policy']);
    } else if (selectedProductCategory.productCategoryName.localeCompare('Contact') === 0) {
      this.router.navigate(['/shop/contact']);
    } else if (selectedProductCategory.productCategoryName.localeCompare('Home') === 0) {
      this.router.navigate([`/shop/home`]);
    } else {
      // share selected product's category
      this.shareProductCategoryService.changeProductCategory(selectedProductCategory);
      // go to product's category
      this.router.navigate([`/shop/category/${selectedProductCategory.productCategoryMetaTitle}`]);
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
   * handle cancel search product modal
   */
  public handleCancelSearchProductModal() {
    this.isSearchProductModalShown = false;
  }

  /**
   * handle confirm search product modal
   */
  public handleConfirmSearchProductModal() {
    // close search product modal
    this.isSearchProductModalShown = false;

    // check product's category is selected or not
    if (typeof this.selectedProductCategoryId !== 'undefined') {
      localStorage.setItem(Config.selectedProductCategoryForSearching, String(this.selectedProductCategoryId));
    }

    // get search's information
    localStorage.setItem(Config.selectedProductMinPriceForSearching, String(this.selectedProductPrice[0]));
    localStorage.setItem(Config.selectedProductMaxPriceForSearching, String(this.selectedProductPrice[1]));
    localStorage.setItem(Config.selectedProductNameKeywordsForSearching, this.selectedPostName);

    // go to product search result component
    this.router.navigate(['/shop/search']);

    // share message to tell search product component that get searching products
    this.shareMessageService.changeMessage('searchProduct');
  }

  /**
   * show search product modal
   */
  public showSearchProductModal() {
    this.isSearchProductModalShown = true;
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

  /**
   * go to shopping cart
   */
  public goToShoppingCart() {
    this.router.navigate(['/shop/cart']);
  }
}
