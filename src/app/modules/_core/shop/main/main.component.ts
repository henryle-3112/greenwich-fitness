import {Component, OnInit} from '@angular/core';
import {Product, ProductCategory} from '@gw-models/core';
import {ProductService} from '@gw-services/core/api/product/product.service';
import {ShareProductService} from '@gw-services/core/shared/product/share-product.service';
import {Router} from '@angular/router';
import {ShareProductCategoryService} from '@gw-services/core/shared/product-category/share-product-category.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  // top men products
  topMenProducts: Product[];

  // top women products
  topWomenProducts: Product[];

  // top gear products
  topGearProducts: Product[];

  // show loading component
  loading: boolean;

  // selected product's category
  selectedProductCategory: ProductCategory;

  // all product's categories
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

  ngOnInit() {
    // get top men's products
    this.getTopMenProducts();
    // get top women's products
    this.getTopWomenProducts();
    // get top gear's products
    this.getTopGearProducts();
    // get all product's category
    this.getAllProductCategories();
  }

  /**
   * get top men's products
   */
  private getTopMenProducts() {
    // show loading component
    this.loading = true;
    // get top men's products
    this.productService.getTopProducts(4, 2, 1)
      .subscribe(products => {
        // hide loading component
        this.loading = false;
        // get top men's products
        this.topMenProducts = products;
      });
  }

  /**
   * get top women's products
   */
  private getTopWomenProducts() {
    // show loading component
    this.loading = true;
    // get top women's products
    this.productService.getTopProducts(4, 3, 1)
      .subscribe(products => {
        // hide loading component
        this.loading = false;
        // get top women's products
        this.topWomenProducts = products;
      });
  }

  /**
   * get top gear products
   */
  private getTopGearProducts() {
    // show loading component
    this.loading = true;
    // get top gear's products
    this.productService.getTopProducts(4, 4, 1)
      .subscribe(products => {
        // hide loading component
        this.loading = false;
        // get top gear's products
        this.topGearProducts = products;
      });
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

  /**
   * go to product's category
   */
  public goToProductCategory(selectedProductCategoryName: string) {
    for (const eachProductCategory of this.productCategories) {
      if (eachProductCategory.productCategoryName.localeCompare(selectedProductCategoryName) === 0) {
        this.selectedProductCategory = eachProductCategory;
        break;
      }
    }
    // share selected product's category
    this.shareProductCategoryService.changeProductCategory(this.selectedProductCategory);
    // go to product's category
    this.router.navigate([`/shop/category/${this.selectedProductCategory.productCategoryMetaTitle}`]);
  }

  /**
   * get all product's categories
   */
  private getAllProductCategories() {
    this.shareProductCategoryService.currentProductCategories
      .subscribe((productCategories: ProductCategory[]) => {
        if (productCategories) {
          this.productCategories = productCategories;
        }
      });
  }
}
