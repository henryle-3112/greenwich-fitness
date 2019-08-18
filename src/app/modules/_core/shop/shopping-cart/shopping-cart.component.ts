import {Component, OnInit} from '@angular/core';
import {Config} from '@gw-config/core';
import {ProductOrder, ProductOrderDetail, ShoppingCart, UserProfile} from '@gw-models/core';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {ProductOrderService} from '@gw-services/core/api/product/product-order.service';
import {ProductOrderDetailService} from '@gw-services/core/api/product/product-order-detail.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {PaymentService} from '@gw-services/core/api/payment/payment.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  isNoData: boolean;
  isLoadingSpinnerShown: boolean;
  shoppingCartProducts: ShoppingCart[];
  totalShoppingCartPrice: number;
  selectedUserProfile: UserProfile;

  /**
   *
   * @param shareUserProfileService - inject shareUserProfileService
   * @param router - inject router
   * @param paymentService - inject paymenService
   * @param productOrderService - inject productOrderService
   * @param productOrderDetailService - inject productOrderDetailService
   * @param notification - inject notification
   */
  constructor(private shareUserProfileService: ShareUserProfileService,
              private router: Router,
              private paymentService: PaymentService,
              private productOrderService: ProductOrderService,
              private productOrderDetailService: ProductOrderDetailService,
              private notification: NzNotificationService) {
  }

  ngOnInit(): void {
    this.getSelectedUserProfile();
    this.getShoppingCartProducts();
  }

  /**
   * get selected user's profile
   */
  public getSelectedUserProfile(): void {
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
        } else {
          this.router.navigate(['/shop/home']);
        }
      });
  }

  /**
   * get shopping cart products
   */
  private getShoppingCartProducts(): void {
    this.isLoadingSpinnerShown = true;
    if (localStorage.getItem(Config.shoppingCart)) {
      this.shoppingCartProducts = [];
      const currentShoppingCart = JSON.parse(localStorage.getItem(Config.shoppingCart));
      this.totalShoppingCartPrice = 0;
      for (const eachShoppingCartProduct of currentShoppingCart) {
        this.shoppingCartProducts.push(eachShoppingCartProduct);
        this.totalShoppingCartPrice += eachShoppingCartProduct.product.productPrice * eachShoppingCartProduct.quantity;
      }
      this.isLoadingSpinnerShown = false;
      this.isNoData = false;
    } else {
      this.isLoadingSpinnerShown = false;
      this.isNoData = true;
    }
  }

  /**
   * clear shopping cart
   */
  public clearShoppingCart(): void {
    this.shoppingCartProducts = [];
    localStorage.removeItem(Config.shoppingCart);
    this.isNoData = true;
  }

  /**
   *
   * @param selectedShoppingCartProduct - selected shopping cart product that user want to remove from shopping cart
   */
  public deleteSelectedShoppingCartProduct(selectedShoppingCartProduct: any): void {
    let removePosition = 0;
    for (let i = 0; i < this.shoppingCartProducts.length; i++) {
      if (this.shoppingCartProducts[i].product.id === selectedShoppingCartProduct.product.id) {
        removePosition = i;
        break;
      }
    }
    this.shoppingCartProducts.splice(removePosition, 1);
    if (this.shoppingCartProducts.length === 0) {
      this.isNoData = true;
      localStorage.removeItem(Config.shoppingCart);
    } else {
      localStorage.setItem(Config.shoppingCart, JSON.stringify(this.shoppingCartProducts));
    }
  }

  /**
   * handle event when user want to pay by cash
   */
  public payByCash(): void {
    this.isLoadingSpinnerShown = true;
    const newProductOrder = new ProductOrder();
    newProductOrder.productOrderDate = new Date();
    newProductOrder.productOrderStatus = 0;
    newProductOrder.userProfile = this.selectedUserProfile;
    const addProductOrderUrl = `${Config.apiBaseUrl}/${Config.apiProductManagementPrefix}/${Config.apiProductOrders}`;
    this.productOrderService.addProductOrder(addProductOrderUrl, newProductOrder)
      .subscribe(insertedProductOrder => {
        if (insertedProductOrder) {
          this.addProductDetails(insertedProductOrder);
          this.isLoadingSpinnerShown = false;
        }
      });
  }

  /**
   *
   * @param insertedProductOrder - selected product order
   */
  private addProductDetails(insertedProductOrder: ProductOrder): void {
    this.isLoadingSpinnerShown = true;
    const productOrderDetails = [];
    for (const eachShoppingCartProduct of this.shoppingCartProducts) {
      const productOrderDetail = new ProductOrderDetail();
      productOrderDetail.productOrder = insertedProductOrder;
      productOrderDetail.product = eachShoppingCartProduct.product;
      productOrderDetail.quantity = eachShoppingCartProduct.quantity;
      productOrderDetails.push(productOrderDetail);
    }
    const addProductOrdersUrl = `${Config.apiBaseUrl}/${Config.apiProductManagementPrefix}/${Config.apiProductOrderDetails}`;
    this.productOrderDetailService.addProductOrderDetails(addProductOrdersUrl, productOrderDetails)
      .subscribe(insertedProductOrderDetails => {
        if (insertedProductOrderDetails) {
          this.createNotification('success', 'Success', 'Thank you! We will contact you soon!');
        } else {
          this.createNotification('error', 'Error', 'Sorry! Please try again!');
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * pay with paypal
   */
  public payWithPaypal(): void {
    this.isLoadingSpinnerShown = true;
    const makePaymentUrl = `${Config.apiBaseUrl}/
${Config.apiPaypalManagementPrefix}/
${Config.apiMakePayment}?
${Config.sumParameter}=${this.totalShoppingCartPrice}`;
    this.paymentService.makePayment(makePaymentUrl)
      .subscribe((response: any) => {
        if (response) {
          // set flag to check user use paypal to buy products not hire coach
          localStorage.setItem(Config.checkWhatUserWantToPay, 'product');
          // save current user profile to localStorage just use for payment component
          // then delete after finishing
          localStorage.setItem(Config.currentUserProfile, JSON.stringify(this.selectedUserProfile));
          window.location.href = response.redirect_url;
        }
      });
  }

  /**
   *
   * @param type - type of notification
   * @param title - title of notification
   * @param content - content of notification
   */
  createNotification(type: string, title: string, content: string): void {
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
  public changeProductQuantity(selectedShoppingCartProduct: ShoppingCart, event): void {
    this.totalShoppingCartPrice = 0;
    for (const eachShoppingCartProduct of this.shoppingCartProducts) {
      this.totalShoppingCartPrice += eachShoppingCartProduct.quantity * eachShoppingCartProduct.product.productPrice;
    }
    localStorage.removeItem(Config.shoppingCart);
    localStorage.setItem(Config.shoppingCart, JSON.stringify(this.shoppingCartProducts));
  }
}
