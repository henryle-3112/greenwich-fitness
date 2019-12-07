import {Component, OnInit} from '@angular/core';
import {Product, ProductCategory} from '@gw-models';
import {ProductService} from '@gw-services/api';
import {ShareProductCategoryService, ShareProductService} from '@gw-services/shared';
import {Router} from '@angular/router';
import {Config} from '@gw-config';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  topMenProducts: Product[];
  topWomenProducts: Product[];
  topGearProducts: Product[];
  isLoadingSpinnerShown: boolean;
  productCategories: ProductCategory[];

  /**
   *
   * @param productService - inject productService
   * @param router - inject router
   * @param shareProductService - inject shareProductService
   * @param shareProductCategoryService - inject shareProductCategoryService
   */
  constructor(private productService: ProductService,
              private router: Router,
              private shareProductService: ShareProductService,
              private shareProductCategoryService: ShareProductCategoryService) {
  }

  ngOnInit(): void {
    this.getTopMenProducts();
    this.getTopWomenProducts();
    this.getTopGearProducts();
    this.getProductCategories();
  }

  /**
   *
   * @param selectedProduct - selected product
   */
  public goToProductDetail(selectedProduct): void {
    this.shareProductService.changeProduct(selectedProduct);
    this.router.navigate([`/shop/product/${selectedProduct.productMetaTitle}`]);
  }

  /**
   *
   * @param selectedProductCategoryName - category that user want to view
   */
  public goToProductCategory(selectedProductCategoryName: string): void {
    let selectedProductCategory = new ProductCategory();
    for (const eachProductCategory of this.productCategories) {
      if (eachProductCategory.productCategoryName.localeCompare(selectedProductCategoryName) === 0) {
        selectedProductCategory = eachProductCategory;
        break;
      }
    }
    this.shareProductCategoryService.changeProductCategory(selectedProductCategory);
    this.router.navigate([`/shop/category/${selectedProductCategory.productCategoryMetaTitle}`]);
  }

  /**
   * get top men's products
   */
  private getTopMenProducts(): void {
    this.isLoadingSpinnerShown = true;
    const menProductCategory = 2;
    const productStatus = 1;
    const topLimit = 4;
    const getTopMenProductsUrl = `${Config.apiBaseUrl}/
${Config.apiProductManagementPrefix}/
${Config.apiProducts}?
${Config.categoryIdParameter}=${menProductCategory}&
${Config.statusParameter}=${productStatus}&
${Config.topParameter}=${topLimit}`;
    this.productService.getProducts(getTopMenProductsUrl)
      .subscribe(response => {
        this.topMenProducts = response.body;
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get top women's products
   */
  private getTopWomenProducts(): void {
    this.isLoadingSpinnerShown = true;
    const womenProductCategory = 3;
    const productStatus = 1;
    const topLimit = 4;
    const getTopWomenProductsUrl = `${Config.apiBaseUrl}/
${Config.apiProductManagementPrefix}/
${Config.apiProducts}?
${Config.categoryIdParameter}=${womenProductCategory}&
${Config.statusParameter}=${productStatus}&
${Config.topParameter}=${topLimit}`;
    this.productService.getProducts(getTopWomenProductsUrl)
      .subscribe(response => {
        this.topWomenProducts = response.body;
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get top gear products
   */
  private getTopGearProducts(): void {
    this.isLoadingSpinnerShown = true;
    const gearProductCategory = 4;
    const productStatus = 1;
    const topLimit = 4;
    const getTopGearProductsUrl = `${Config.apiBaseUrl}/
${Config.apiProductManagementPrefix}/
${Config.apiProducts}?
${Config.categoryIdParameter}=${gearProductCategory}&
${Config.statusParameter}=${productStatus}&
${Config.topParameter}=${topLimit}`;
    this.productService.getProducts(getTopGearProductsUrl)
      .subscribe(response => {
        this.topGearProducts = response.body;
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get all product's categories
   */
  private getProductCategories(): void {
    this.shareProductCategoryService.currentProductCategories
      .subscribe((productCategories: ProductCategory[]) => {
        if (productCategories) {
          this.productCategories = productCategories;
        }
      });
  }
}
