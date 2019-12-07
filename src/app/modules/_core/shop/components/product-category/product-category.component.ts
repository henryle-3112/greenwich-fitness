import {Component, OnInit} from '@angular/core';
import {Product, ProductCategory} from '@gw-models';
import {ProductService} from '@gw-services/api';
import {ShareProductCategoryService, ShareProductService} from '@gw-services/shared';
import {ActivatedRoute, Router} from '@angular/router';
import {Config} from '@gw-config';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {
  productsByCategory: Product[];
  isLoadingSpinnerShown: boolean;
  currentProductsByCategoryPage: number;
  selectedProductCategory: ProductCategory;
  nProductsByCategoryPerPage: number;
  totalProductsByCategory: number;

  /**
   *
   * @param productService - inject productService
   * @param shareProductCategoryService - inject shareProductCategoryService
   * @param route - inject route
   * @param router - inject router
   * @param shareProductService - inject shareProductService
   */
  constructor(private productService: ProductService,
              private shareProductCategoryService: ShareProductCategoryService,
              private router: Router,
              private route: ActivatedRoute,
              private shareProductService: ShareProductService) {
  }

  ngOnInit(): void {
    this.initData();
    this.getSelectedProductCategory();
  }

  /**
   *
   * @param event - current page
   */
  public productsPageChange(event): void {
    this.isLoadingSpinnerShown = true;
    this.currentProductsByCategoryPage = event;
    this.getProductsByCategory();
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

  /**
   * init data
   */
  private initData(): void {
    this.nProductsByCategoryPerPage = 8;
    this.currentProductsByCategoryPage = 1;
  }

  /**
   * get selected product's category
   */
  private getSelectedProductCategory(): void {
    this.isLoadingSpinnerShown = true;
    this.shareProductCategoryService.currentProductCategory
      .subscribe(selectedProductCategory => {
        if (selectedProductCategory) {
          this.selectedProductCategory = selectedProductCategory;
          this.checkProductCategoryExistedOrNot();
        } else {
          this.router.navigate(['/shop/home']);
        }
      });
  }

  /**
   * check product's category existed or not
   */
  private checkProductCategoryExistedOrNot(): void {
    // check is product's category or not
    const isProductCategory = this.selectedProductCategory.productCategoryName.localeCompare('About') !== 0 &&
      this.selectedProductCategory.productCategoryName.localeCompare('Contact') !== 0 &&
      this.selectedProductCategory.productCategoryName.localeCompare('Privacy Policy') !== 0 &&
      this.selectedProductCategory.productCategoryName.localeCompare('Home') !== 0;
    if (isProductCategory) {
      this.getProductsByCategory();
    }
  }

  /**
   * get products by category and by page
   */
  private getProductsByCategory(): void {
    const selectedProductCategoryId = this.selectedProductCategory.id;
    const productStatus = 1;
    const getProductsByCategoryUrl = `${Config.apiBaseUrl}/
${Config.apiProductManagementPrefix}/
${Config.apiProducts}?
${Config.categoryIdParameter}=${selectedProductCategoryId}&
${Config.statusParameter}=${productStatus}&
${Config.pageParameter}=${this.currentProductsByCategoryPage}`;
    this.productService.getProducts(getProductsByCategoryUrl)
      .subscribe(response => {
        this.productsByCategory = response.body;
        this.totalProductsByCategory = Number(response.headers.get(Config.headerXTotalCount));
        this.isLoadingSpinnerShown = false;
      });
  }
}
