import {Component, OnInit} from '@angular/core';
import {Config} from '@gw-config/core';
import {ProductOrder, ProductOrderDetail, ShoppingCart, UserProfile} from '@gw-models/core';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {ProductOrderService} from '@gw-services/core/api/product/product-order.service';
import {ProductOrderDetailService} from '@gw-services/core/api/product/product-order-detail.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {PaymentService} from '@gw-services/core/api/payment/payment.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  // check data is empty or not
  isNoData: boolean;

  // check loading component is showing or not
  loading: boolean;

  // list of shopping cart products
  shoppingCartProducts: ShoppingCart[];

  // total price that user have to pay
  totalPrice: number;

  // selected user's profile
  selectedUserProfile: UserProfile;

  /**
   *
   * @param shareUserProfileService - inject shareUserProfileService
   * @param paymentService - inject paymenService
   * @param productOrderService - inject productOrderService
   * @param productOrderDetailService - inject productOrderDetailService
   * @param notification - inject notification
   */
  constructor(private shareUserProfileService: ShareUserProfileService,
              private paymentService: PaymentService,
              private productOrderService: ProductOrderService,
              private productOrderDetailService: ProductOrderDetailService,
              private notification: NzNotificationService) {
  }

  ngOnInit() {
    // get selected user's profile
    this.getSelectedUserProfile();
    // get shopping cart products
    this.getShoppingCartProducts();
  }

  /**
   * get selected user's profile
   */
  public getSelectedUserProfile() {
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
        }
      });
  }

  /**
   * get shopping cart products
   */
  private getShoppingCartProducts() {
    // show loading component
    this.loading = true;
    // get shopping cart products
    if (localStorage.getItem(Config.shoppingCart)) {
      // init shopping cart product list
      this.shoppingCartProducts = [];
      // get current shopping cart from local storage
      const currentShoppingCart = JSON.parse(localStorage.getItem(Config.shoppingCart));
      // add to shopping cart products list and calculate total price
      this.totalPrice = 0;
      for (const eachShoppingCartProduct of currentShoppingCart) {
        this.shoppingCartProducts.push(eachShoppingCartProduct);
        this.totalPrice += eachShoppingCartProduct.product.productPrice * eachShoppingCartProduct.quantity;
      }
      // calculate total price that user have to pay
      // hide loading component
      this.loading = false;
      // hide no data component
      this.isNoData = false;
    } else {
      // hide loading component
      this.loading = false;
      // show no data component
      this.isNoData = true;
    }
  }

  /**
   * clear shopping cart
   */
  public clearShoppingCart() {
    // clear current list
    this.shoppingCartProducts = [];
    // clear local storage
    localStorage.removeItem(Config.shoppingCart);
    // show no data component
    this.isNoData = true;
  }

  /**
   *
   * @param selectedShoppingCartProduct - selected shopping cart product
   */
  public deleteSelectedShoppingCartProduct(selectedShoppingCartProduct) {
    // remove selected shopping cart product from current list
    // find remove position
    let removePosition = 0;
    for (let i = 0; i < this.shoppingCartProducts.length; i++) {
      if (this.shoppingCartProducts[i].product.id === selectedShoppingCartProduct.product.id) {
        removePosition = i;
        break;
      }
    }
    this.shoppingCartProducts.splice(removePosition, 1);
    if (this.shoppingCartProducts.length === 0) {
      // show no data component
      this.isNoData = true;
      // clear shoppping cart from local storage
      localStorage.removeItem(Config.shoppingCart);
    } else {
      // remove from localStorage
      localStorage.setItem(Config.shoppingCart, JSON.stringify(this.shoppingCartProducts));
    }
  }

  /**
   * handle event when user want to pay by cash
   */
  public payByCash() {
    // show loading component
    this.loading = true;
    // create new product's order object
    const newProductOrder = new ProductOrder();
    newProductOrder.productOrderDate = new Date();
    newProductOrder.productOrderStatus = 0;
    newProductOrder.userProfile = this.selectedUserProfile;

    const that = this;
    // add new product's order to server
    this.productOrderService.addProductOrder(newProductOrder)
      .subscribe(insertedProductOrder => {
        if (insertedProductOrder) {
          // add each product to product's order detail
          this.addProductDetails(insertedProductOrder);
          // hide loading component
          this.loading = false;
        }
      });
  }

  /**
   * pay with paypal
   */
  public payWithPaypal() {
    // show loading component
    this.loading = true;
    this.paymentService.makePayment(this.totalPrice)
      .subscribe((response: any) => {
        if (response) {
          // set flag to check user use paypal to buy products not hire coach
          localStorage.setItem(Config.checkWhatUserWantToPay, 'product');
          // save current user profile to localStorage just use for payment component
          // then delete after finishing
          localStorage.setItem(Config.currentUserProfile, JSON.stringify(this.selectedUserProfile));
          window.location.href = response.redirect_url;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   *
   * @param insertedProductOrder - selected product order
   */
  private addProductDetails(insertedProductOrder) {
    // show loading component
    this.loading = true;
    // create list of product order details
    const productOrderDetails = [];
    for (const eachShoppingCartProduct of this.shoppingCartProducts) {
      // create new product order detail object
      const productOrderDetail = new ProductOrderDetail();
      productOrderDetail.productOrder = insertedProductOrder;
      productOrderDetail.product = eachShoppingCartProduct.product;
      productOrderDetail.quantity = eachShoppingCartProduct.quantity;

      // add to product order detail list
      productOrderDetails.push(productOrderDetail);
    }

    // add to server
    this.productOrderDetailService.addProductOrderDetail(productOrderDetails)
      .subscribe(insertedProductOrderDetails => {
        if (insertedProductOrderDetails) {
          // show message to user
          this.createNotification('success', 'Success', 'Thank you! We will contact you soon!');
        } else {
          // show error message
          this.createNotification('error', 'Error', 'Sorry! Please try again!');
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   *
   * @param type - type of notification
   * @param title - title of notification
   * @param content - content of notification
   */
  createNotification(type: string, title: string, content: string) {
    this.notification.create(
      type,
      title,
      content
    );
  }

  /**
   *
   * @param selectedShoppingCartProduct - selected shopping cart product
   * @param event - number of shopping cart product
   */
  public changeProductQuantity(selectedShoppingCartProduct: ShoppingCart, event) {
    // calculate total price after selected shopping cart product's quantity was updated
    this.totalPrice = 0;
    for (const eachShoppingCartProduct of this.shoppingCartProducts) {
      this.totalPrice = this.totalPrice + eachShoppingCartProduct.quantity * eachShoppingCartProduct.product.productPrice;
    }
    // update local storage
    localStorage.removeItem(Config.shoppingCart);
    localStorage.setItem(Config.shoppingCart, JSON.stringify(this.shoppingCartProducts));
  }
}
