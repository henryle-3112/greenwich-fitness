import {Component, OnDestroy, OnInit} from '@angular/core';
import {Config} from '@gw-config/core';
import {Product} from '@gw-models/core';
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
  isLoadingSpinnerShown: boolean;
  totalSearchingProducts: number;
  currentSearchingProductsPage: number;
  nSearchingProductsPerPage: number;
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

  ngOnInit(): void {
    this.shareMessageService.currentMessage
      .subscribe(message => {
        if (message && message.localeCompare('searchProduct') === 0) {
          this.checkSearchParametersExistedOrNot();
          this.initData();
        }
      });
  }

  /**
   * check search parameters existed or not
   */
  private checkSearchParametersExistedOrNot(): void {
    const isSearchingParametersNotExisted = !localStorage.getItem(Config.selectedProductCategoryForSearching) &&
      !localStorage.getItem(Config.selectedProductNameKeywordsForSearching) &&
      !localStorage.getItem(Config.selectedProductMinPriceForSearching) &&
      !localStorage.getItem(Config.selectedProductMaxPriceForSearching);
    if (isSearchingParametersNotExisted) {
      this.router.navigate(['/shop/home']);
    }
  }

  /**
   * init data
   */
  private initData(): void {
    this.currentSearchingProductsPage = 1;
    this.nSearchingProductsPerPage = 8;
    this.getSearchingProducts();
  }

  /**
   * get searching products
   */
  private getSearchingProducts(): void {
    this.isLoadingSpinnerShown = true;
    const productStatus = 1;
    let getSearchingProductsUrl = `${Config.apiBaseUrl}/
${Config.apiProductManagementPrefix}/
${Config.apiProducts}?
${Config.categoryIdParameter}=&
${Config.minPriceParameter}=&
${Config.maxPriceParameter}=&
${Config.searchParameter}=&
${Config.pageParameter}=${this.currentSearchingProductsPage}&
${Config.statusParameter}=${productStatus}`;
    if (localStorage.getItem(Config.selectedProductCategoryForSearching)) {
      const selectedProductCategoryIdForSearching = Number(localStorage.getItem(Config.selectedProductCategoryForSearching));
      getSearchingProductsUrl = getSearchingProductsUrl.replace(
        `${Config.categoryIdParameter}=`,
        `${Config.categoryIdParameter}=${selectedProductCategoryIdForSearching}`);
    }
    if (localStorage.getItem(Config.selectedProductMinPriceForSearching) &&
      localStorage.getItem(Config.selectedProductMaxPriceForSearching)) {
      const selectedProductMinPriceForSearching = Number(localStorage.getItem(Config.selectedProductMinPriceForSearching));
      const selectedProductMaxPriceForSearching = Number(localStorage.getItem(Config.selectedProductMaxPriceForSearching));
      getSearchingProductsUrl = getSearchingProductsUrl.replace(
        `${Config.minPriceParameter}=&${Config.maxPriceParameter}=`,
        `${Config.minPriceParameter}=${selectedProductMinPriceForSearching}&
        ${Config.maxPriceParameter}=${selectedProductMaxPriceForSearching}`);
    }
    if (localStorage.getItem(Config.selectedProductNameKeywordsForSearching)) {
      const selectedProductNameForSearching = localStorage.getItem(Config.selectedProductNameKeywordsForSearching);
      getSearchingProductsUrl = getSearchingProductsUrl.replace(
        `${Config.searchParameter}=`,
        `${Config.searchParameter}=${selectedProductNameForSearching}`);
    }
    this.productService.getProducts(getSearchingProductsUrl)
      .subscribe(response => {
        this.searchingProducts = response.body;
        this.totalSearchingProducts = Number(response.headers.get(Config.headerXTotalCount));
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param event - current page
   */
  public productsPageChange(event): void {
    this.currentSearchingProductsPage = event;
    this.getSearchingProducts();
  }


  /**
   *
   * @param selectedProduct - selected product that user want to view
   */
  public goToProductDetail(selectedProduct): void {
    // share product to other components
    this.shareProductService.changeProduct(selectedProduct);
    this.router.navigate([`/shop/product/${selectedProduct.productMetaTitle}`]);
  }

  ngOnDestroy(): void {
    // clear local storage
    localStorage.removeItem(Config.selectedProductCategoryForSearching);
    localStorage.removeItem(Config.selectedProductMinPriceForSearching);
    localStorage.removeItem(Config.selectedProductMaxPriceForSearching);
    localStorage.removeItem(Config.selectedProductNameKeywordsForSearching);
  }
}
