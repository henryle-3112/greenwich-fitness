import {Component, OnDestroy, OnInit} from '@angular/core';
import {Config} from '@gw-config/core';
import {Product, ResponseMessage} from '@gw-models/core';
import {ProductService} from '@gw-services/core/api/product/product.service';
import {Router} from '@angular/router';
import {ShareMessageService} from '@gw-services/core/shared/message/share-message.service';
import {ShareProductService} from '@gw-services/core/shared/product/share-product.service';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit, OnDestroy {

  // check loading component is showing or not
  loading: boolean;

  // selected product's category's id (for searching)
  selectedProductCategoryId: number;

  // selected product's price (for searching)
  selectedProductMinPrice: any;
  selectedProductMaxPrice: any;

  // selected product's category's name (for searching)
  selectedProductCategoryName: string;

  // total products for pagination
  totalProducts: number;

  // current page for pagination
  currentPage: number;

  // number products per page
  nProductsPerPage: number;

  // searching products
  searchingProducts: Product[];


  /**
   *
   * @param productService - inject productService
   * @param router - inject router
   * @param shareMessageService - inject shareMessageService
   * @param shareProductService - inject shareProductService
   */
  constructor(private productService: ProductService,
              private router: Router,
              private shareMessageService: ShareMessageService,
              private shareProductService: ShareProductService) {
  }

  ngOnInit() {
    // check search parameters existed or not. If not redirect to home page
    this.checkSearchParametersExistedOrNot();
    this.shareMessageService.currentMessage
      .subscribe(message => {
        if (message && message.localeCompare('searchProduct') === 0) {
          // check search parameters existed or not. If not redirect to home page
          this.checkSearchParametersExistedOrNot();
          // init data
          this.initData();
        }
      });
  }

  /**
   * init data
   */
  private initData() {
    // current page
    this.currentPage = 1;

    // init number products per page
    this.nProductsPerPage = 8;

    // get search's information that user want to search
    this.selectedProductCategoryId = Number(localStorage.getItem(Config.selectedProductCategoryForSearching));
    this.selectedProductMinPrice = Number(localStorage.getItem(Config.selectedProductMinPriceForSearching));
    this.selectedProductMaxPrice = Number(localStorage.getItem(Config.selectedProductMaxPriceForSearching));
    this.selectedProductCategoryName = localStorage.getItem(Config.selectedProductNameKeywordsForSearching);

    // get number of searching products
    this.getNumberOfSearchingProducts();
    // get search result
    this.getSearchingProductsByPage();
  }

  /**
   * get searching products
   */
  private getSearchingProductsByPage() {
    // show loading component
    this.loading = true;
    // base url
    let getSearchingProductsUrl =
      `${Config.api}/${Config.apiGetSearchingProductsByPage}/${this.currentPage}` +
      `/1?categoryId=&productMinPrice=&productMaxPrice=&productNameKeywords=`;
    if (localStorage.getItem(Config.selectedProductCategoryForSearching)) {
      this.selectedProductCategoryId = Number(localStorage.getItem(Config.selectedProductCategoryForSearching));
      getSearchingProductsUrl = getSearchingProductsUrl.replace('categoryId=', `categoryId=${this.selectedProductCategoryId}`);
    }
    if (this.selectedProductMaxPrice !== 0 && this.selectedProductMaxPrice > this.selectedProductMinPrice) {
      getSearchingProductsUrl = getSearchingProductsUrl.replace('productMinPrice=&productMaxPrice=',
        `productMinPrice=${this.selectedProductMinPrice}&productMaxPrice=${this.selectedProductMaxPrice}`);
    }
    if (this.selectedProductCategoryName.localeCompare('') !== 0) {
      getSearchingProductsUrl = getSearchingProductsUrl.replace('productNameKeywords=',
        `productNameKeywords=${this.selectedProductCategoryName}`);
    }
    console.log(`Current searching url: ${getSearchingProductsUrl}`);
    this.productService.getSearchingProductsByPage(getSearchingProductsUrl)
      .subscribe(products => {
        if (products) {
          // get products
          this.searchingProducts = products;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get number of searching products
   */
  private getNumberOfSearchingProducts() {
    // show loading component
    this.loading = true;
    // base url
    let getNumberOfSearchingProductsUrl =
      `${Config.api}/${Config.apiGetNumberOfSearchingProducts}/1?categoryId=&productMinPrice=&productMaxPrice=&productNameKeywords=`;
    if (localStorage.getItem(Config.selectedProductCategoryForSearching)) {
      this.selectedProductCategoryId = Number(localStorage.getItem(Config.selectedProductCategoryForSearching));
      getNumberOfSearchingProductsUrl = getNumberOfSearchingProductsUrl.replace('categoryId=',
        `categoryId=${this.selectedProductCategoryId}`);
    }
    if (this.selectedProductMaxPrice !== 0 && this.selectedProductMaxPrice > this.selectedProductMinPrice) {
      getNumberOfSearchingProductsUrl = getNumberOfSearchingProductsUrl.replace('productMinPrice=&productMaxPrice=',
        `productMinPrice=${this.selectedProductMinPrice}&productMaxPrice=${this.selectedProductMaxPrice}`);
    }
    if (this.selectedProductCategoryName.localeCompare('') !== 0) {
      getNumberOfSearchingProductsUrl = getNumberOfSearchingProductsUrl.replace('productNameKeywords=',
        `productNameKeywords=${this.selectedProductCategoryName}`);
    }
    console.log(`Current searching url: ${getNumberOfSearchingProductsUrl}`);
    this.productService.getNumberOfSearchingProducts(getNumberOfSearchingProductsUrl)
      .subscribe((responseMessage: ResponseMessage) => {
        if (responseMessage) {
          this.totalProducts = Number(responseMessage.message);
          console.log(`Total Products: ${this.totalProducts}`);
        }
        // hide loading component
      });
  }

  /**
   *
   * @param event - current page
   */
  public productsPageChange(event) {
    // set current page
    this.currentPage = event;
    // reload data
    this.getSearchingProductsByPage();
  }

  /**
   * check search parameters existed or not
   */
  private checkSearchParametersExistedOrNot() {
    if (!localStorage.getItem(Config.selectedProductCategoryForSearching) &&
      !localStorage.getItem(Config.selectedProductNameKeywordsForSearching) &&
      !localStorage.getItem(Config.selectedProductMinPriceForSearching) &&
      !localStorage.getItem(Config.selectedProductMaxPriceForSearching)
    ) {
      this.router.navigate(['/shop/home']);
    }
  }

  /**
   *
   * @param selectedProduct - selected product
   */
  public goToProductDetail(selectedProduct) {
    // share product to other components
    this.shareProductService.changeProduct(selectedProduct);
    // go to product's detail page
    this.router.navigate([`/shop/product/${selectedProduct.productMetaTitle}`]);
  }

  ngOnDestroy(): void {
    // clear local storage
    localStorage.removeItem(Config.selectedProductCategoryForSearching);
    localStorage.removeItem(Config.selectedProductMaxPriceForSearching);
    localStorage.removeItem(Config.selectedProductMinPriceForSearching);
    localStorage.removeItem(Config.selectedProductNameKeywordsForSearching);
  }
}
