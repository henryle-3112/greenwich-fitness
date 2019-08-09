import {Component, OnInit} from '@angular/core';
import {Product, ProductCategory, ResponseMessage} from '@gw-models/core';
import {ProductService} from '@gw-services/core/api/product/product.service';
import {ShareProductCategoryService} from '@gw-services/core/shared/product-category/share-product-category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ShareProductService} from '@gw-services/core/shared/product/share-product.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {
  // list of product's by category
  productsByCategory: Product[];

  // check loading component is showing or not
  loading: boolean;

  // current page
  currentPage: number;

  // get selected product's category
  selectedProductCategory: ProductCategory;

  // check is product's category or not
  isProductCategory: boolean;

  // number products per page
  nProductsPerPage: number;

  // total products
  totalProducts: number;

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

  ngOnInit() {
    // init data
    this.initData();
    // get selected product's category
    this.getSelectedProductCategory();
  }

  /**
   * get selected product's category
   */
  private getSelectedProductCategory() {
    // show loading component
    this.loading = true;
    this.shareProductCategoryService.currentProductCategory
      .subscribe(selectedProductCategory => {
        // get selected product's category
        this.selectedProductCategory = selectedProductCategory;
        // check selected product's category existed or not
        this.checkProductCategoryExistedOrNot();
      });
  }

  /**
   * get products by category and by page
   */
  private loadProductsByCategoryAndByPage() {
    // get products
    this.productService.getProductsByCategoryAndByPage(this.selectedProductCategory.id, this.currentPage, 1)
      .subscribe(products => {
        // get products
        this.productsByCategory = products;
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * check product's category existed or not
   */
  private checkProductCategoryExistedOrNot() {
    console.log(`hello`);
    if (this.selectedProductCategory == null) {
      // redirect to home page
      this.router.navigate(['/shop/home']);
    } else {
      // check is product's category or not
      if (this.selectedProductCategory.productCategoryName.localeCompare('About') !== 0 &&
        this.selectedProductCategory.productCategoryName.localeCompare('Contact') !== 0 &&
        this.selectedProductCategory.productCategoryName.localeCompare('Privacy Policy') !== 0 &&
        this.selectedProductCategory.productCategoryName.localeCompare('Home') !== 0) {
        this.isProductCategory = true;
      }
      // load product by category and by page
      this.loadProductsByCategoryAndByPage();
      // load total products by category
      this.loadTotalProductsByCategory();
    }
  }

  /**
   * init data
   */
  private initData() {
    // init number products per page
    this.nProductsPerPage = 8;
    // init current page
    this.currentPage = 1;
  }

  /**
   * load total products by category
   */
  private loadTotalProductsByCategory() {
    this.productService.getNumberOfProductsByCategory(this.selectedProductCategory.id, 1)
      .subscribe((responseMessage: ResponseMessage) => {
        if (responseMessage) {
          this.totalProducts = Number(responseMessage.message);
        }
      });
  }

  /**
   *
   * @param event - current page
   */
  public productsPageChange(event) {
    // show loading component
    this.loading = true;
    // set new page
    this.currentPage = event;
    // load new data
    this.loadProductsByCategoryAndByPage();
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
}
