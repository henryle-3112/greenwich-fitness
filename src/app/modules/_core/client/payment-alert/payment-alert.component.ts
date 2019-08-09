import {Component, OnInit} from '@angular/core';
import {PaymentService} from '@gw-services/core/api/payment/payment.service';
import {Config} from '@gw-config/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  Coach, CoachMembershipNotification,
  CoachPayment,
  Membership,
  ProductOrder,
  ProductOrderDetail,
  ProductPayment,
  ShoppingCart,
  UserProfile
} from '@gw-models/core';
import {ProductOrderService} from '@gw-services/core/api/product/product-order.service';
import {ProductOrderDetailService} from '@gw-services/core/api/product/product-order-detail.service';
import {Coffeti} from '@gw-models/core';
import {ProductPaymentService} from '@gw-services/core/api/payment/product-payment.service';
import {CoachPaymentService} from '@gw-services/core/api/payment/coach-payment.service';
import {CoachRateService} from '@gw-services/core/api/coach/coach-rate.service';
import {MembershipService} from '@gw-services/core/api/coach/membership.service';
import {CoachMembershipNotificationService} from '@gw-services/core/api/notification/coach-membership-notification.service';

@Component({
  selector: 'app-payment-alert',
  templateUrl: './payment-alert.component.html',
  styleUrls: ['./payment-alert.component.css']
})
export class PaymentAlertComponent implements OnInit {

  // check loading component is showing or not
  loading: boolean;

  // check payment is successfully or not
  isPaymentSuccessfully: boolean;

  // check what user want to pay
  checkWhatUserWantToPay: string;

  // get payment id
  paymentId: string;

  // get payer id
  payerId: string;

  // token
  token: string;

  // shopping cart products
  shoppingCartProducts: ShoppingCart[];

  // selected user's profile
  selectedUserProfile: UserProfile;

  // total price of shopping carts
  totalPrice: number;

  // coffeti interval to show coffeti animation
  coffetiInterval: any;

  // selected coach that user want to hire
  selectedCoach: Coach;

  // coach averate rating
  rateAverage: number;

  // coach membership notification
  selectedCoachMembershipNotification: CoachMembershipNotification;


  /**
   *
   * @param paymentService - inject paymentService
   * @param productPaymentService - inject productPaymentService
   * @param coachMembershipNotificationService - inject coachMembershipNotificationService
   * @param coachPaymentService - inject coachPaymentService
   * @param coachRateService - inject coachRateService
   * @param membershipService - inject membershipService
   * @param router - inject router
   * @param route - inject route
   * @param productOrderService - inject productOrderService
   * @param productOrderDetailService - inject productOrderDetailService
   */
  constructor(private paymentService: PaymentService,
              private productPaymentService: ProductPaymentService,
              private coachMembershipNotificationService: CoachMembershipNotificationService,
              private coachPaymentService: CoachPaymentService,
              private coachRateService: CoachRateService,
              private membershipService: MembershipService,
              private router: Router,
              private route: ActivatedRoute,
              private productOrderService: ProductOrderService,
              private productOrderDetailService: ProductOrderDetailService) {
    this.route.queryParams.subscribe(params => {
      this.paymentId = params['paymentId'];
      this.payerId = params['PayerID'];
      this.token = params['token'];
    });
  }

  ngOnInit() {
    if (typeof this.paymentId === 'undefined' || typeof this.payerId === 'undefined' || typeof this.token === 'undefined') {
      // if query url parameters does not existed, redirect to feed
      // redirect to client feed page
      this.router.navigate(['/client/feed']);
    } else {
      // get what user want to pay
      if (localStorage.getItem(Config.checkWhatUserWantToPay)) {
        // get selected user profile
        this.getSelectedUserProfile();
        // check what user want to buy/hire
        this.checkWhatUserWantToBuy();
      } else {
        // redirect to client feed page
        this.router.navigate(['/client/feed']);
      }
    }
  }

  /**
   * check what user want to buy
   */
  private checkWhatUserWantToBuy() {
    this.checkWhatUserWantToPay = localStorage.getItem(Config.checkWhatUserWantToPay);
    if (this.checkWhatUserWantToPay.localeCompare('product') === 0) {
      // get products from shopping cart
      this.getProductsFromShoppingCart();
    } else if (this.checkWhatUserWantToPay.localeCompare('coach') === 0) {
      // init rate average
      this.rateAverage = 0;
      // user want to hire coach
      // get selected coach that user want to hire
      this.getSelectedCoach();
    }
  }

  /**
   * get selected coach
   */
  private getSelectedCoach() {
    if (localStorage.getItem(Config.currentCoach)) {
      this.selectedCoach = JSON.parse(localStorage.getItem(Config.currentCoach));
      console.log(this.selectedCoach);
      // get selected coach membership notification
      this.getSelectedCoachMembershipNotification();
    } else {
      // clear coach membership notification
      localStorage.removeItem(Config.currentCoachMembershipNotification);
      // clear current coach
      localStorage.removeItem(Config.currentCoach);
      // clear current user from local storage
      localStorage.removeItem(Config.currentUserProfile);
      // redirect to client feed page
      this.router.navigate(['/client/feed']);
    }
  }

  private getSelectedCoachMembershipNotification() {
    if (localStorage.getItem(Config.currentCoachMembershipNotification)) {
      this.selectedCoachMembershipNotification = JSON.parse(localStorage.getItem(Config.currentCoachMembershipNotification));
      console.log(this.selectedCoachMembershipNotification);
      // call complete coach payment
      this.callCompleteCoachPayment();
    } else {
      // clear coach membership notification
      localStorage.removeItem(Config.currentCoachMembershipNotification);
      // clear current coach
      localStorage.removeItem(Config.currentCoach);
      // clear current user from local storage
      localStorage.removeItem(Config.currentUserProfile);
      // redirect to client feed page
      this.router.navigate(['/client/feed']);
    }
  }

  /**
   * call complete coach payment
   */
  private callCompleteCoachPayment() {
    // call complete payment
    // show loading component
    this.loading = true;
    this.paymentService.completePayment(
      this.paymentId,
      this.payerId)
      .subscribe((response: any) => {
        console.log(response);
        if (response.status.localeCompare('success') === 0) {
          // show success message to user
          this.isPaymentSuccessfully = true;
          // get rating average
          this.getCoachRateAverage();
          // add membership
          this.addMembership();
        } else {
          // show error message to user
          this.isPaymentSuccessfully = false;
          // clear coach membership notification
          localStorage.removeItem(Config.currentCoachMembershipNotification);
          // clear current coach
          localStorage.removeItem(Config.currentCoach);
          // clear current user from local storage
          localStorage.removeItem(Config.currentUserProfile);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get coach's rate's average
   */
  private getCoachRateAverage() {
    // show loading component
    this.loading = true;
    this.coachRateService.getCoachRateAverage(this.selectedCoach.id)
      .subscribe(rateAverage => {
        if (rateAverage) {
          this.rateAverage = Number(rateAverage.message);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * add membership
   */
  private addMembership() {
    // show loading component
    this.loading = true;
    // check membership existed or not
    this.membershipService.getMembershipByCoachAndByUserProfile(this.selectedCoach.id, this.selectedUserProfile.id)
      .subscribe((selectedMembership: Membership) => {
        if (selectedMembership) {
          selectedMembership.status = 1;
          selectedMembership.startDate = new Date();
          // update selected membership
          this.updateMembership(selectedMembership);
        } else {
          // add membership to server
          this.addMembershipToServer();
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   *
   * @param selectedMembership - selected membership that user want to update
   */
  private updateMembership(selectedMembership: Membership) {
    // show loading component
    this.loading = true;
    this.membershipService.updateMembership(selectedMembership)
      .subscribe((updatedMembership: Membership) => {
        if (updatedMembership) {
          this.addCoachPaymentToServer(updatedMembership);
        } else {
          // show error message to user
          this.isPaymentSuccessfully = false;
          // clear coach membership notification
          localStorage.removeItem(Config.currentCoachMembershipNotification);
          // clear current coach
          localStorage.removeItem(Config.currentCoach);
          // clear current user from local storage
          localStorage.removeItem(Config.currentUserProfile);
        }
      });
  }

  /**
   * add membership to server
   */
  private addMembershipToServer() {
    // show loading component
    this.loading = true;
    // create membership object
    const membership = new Membership();
    membership.userProfile = this.selectedUserProfile;
    membership.coach = this.selectedCoach;
    membership.status = 1;
    membership.startDate = new Date();
    // add membership to server
    this.membershipService.addMembership(membership)
      .subscribe((insertedMembership: Membership) => {
        if (insertedMembership) {
          this.addCoachPaymentToServer(insertedMembership);
        } else {
          // show error message to user
          this.isPaymentSuccessfully = false;
          // clear coach membership notification
          localStorage.removeItem(Config.currentCoachMembershipNotification);
          // clear current coach
          localStorage.removeItem(Config.currentCoach);
          // clear current user from local storage
          localStorage.removeItem(Config.currentUserProfile);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * add coach payment to server
   */
  private addCoachPaymentToServer(insertedMembership: Membership) {
    // show loading component
    this.loading = true;
    // create coach payment object
    const coachPayment = new CoachPayment();
    coachPayment.createdDate = new Date();
    coachPayment.membership = insertedMembership;
    coachPayment.payerId = this.payerId;
    coachPayment.paymentId = this.paymentId;
    coachPayment.token = this.token;
    // add coach payment to server
    this.coachPaymentService.addCoachPayment(coachPayment)
      .subscribe((insertedCoachPayment: CoachPayment) => {
        if (insertedCoachPayment) {
          this.updateCoachMembershipNotification();
          // create coffeti object
          const coffeti = new Coffeti();
          this.coffetiInterval = setInterval(() => {
            coffeti.shoot();
          }, 1000);
          // show success message to user
          this.isPaymentSuccessfully = true;
          // clear coach membership notification
          localStorage.removeItem(Config.currentCoachMembershipNotification);
          // clear user profile from local storage
          localStorage.removeItem(Config.currentUserProfile);
          // clear current coach from local storage
          localStorage.removeItem(Config.currentCoach);
        } else {
          // show error message to user
          this.isPaymentSuccessfully = false;
          // clear coach membership notification
          localStorage.removeItem(Config.currentCoachMembershipNotification);
          // clear user profile from local storage
          localStorage.removeItem(Config.currentUserProfile);
          // clear current coach from local storage
          localStorage.removeItem(Config.currentCoach);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * update coach membership notification
   */
  private updateCoachMembershipNotification() {
    // status = 2. It means that user has pay
    this.selectedCoachMembershipNotification.status = 2;
    this.coachMembershipNotificationService.updateCoachMembershipNotification(this.selectedCoachMembershipNotification)
      .subscribe((updatedCoachMembershipNotification: CoachMembershipNotification) => {
        console.log(updatedCoachMembershipNotification);
      });
  }

  /**
   * get selected user's profile
   */
  private getSelectedUserProfile() {
    if (localStorage.getItem(Config.currentUserProfile)) {
      this.selectedUserProfile = JSON.parse(localStorage.getItem(Config.currentUserProfile));
      console.log(this.selectedUserProfile);
    } else {
      // clear coach membership notification
      localStorage.removeItem(Config.currentCoachMembershipNotification);
      // clear current coach
      localStorage.removeItem(Config.currentCoach);
      // clear current user from local storage
      localStorage.removeItem(Config.currentUserProfile);
      // redirect to client feed page
      this.router.navigate(['/client/feed']);
    }
  }

  /**
   * get products from shopping cart
   */
  private getProductsFromShoppingCart() {
    if (localStorage.getItem(Config.shoppingCart)) {
      // init total price
      this.totalPrice = 0;
      // init shopping cart products
      this.shoppingCartProducts = [];
      const currentShoppingCart = JSON.parse(localStorage.getItem(Config.shoppingCart));
      for (const eachShoppingCart of currentShoppingCart) {
        this.totalPrice = this.totalPrice + eachShoppingCart.product.productPrice * eachShoppingCart.quantity;
        this.shoppingCartProducts.push(eachShoppingCart);
      }
      console.log(this.shoppingCartProducts);
      this.callCompleteProductsPayment();
    } else {
      // clear current user from local storage
      localStorage.removeItem(Config.currentUserProfile);
      // redirect client feed page
      this.router.navigate(['/client/feed']);
    }
  }

  /**
   * call complete payment method
   */
  private callCompleteProductsPayment() {
    // call complete payment
    // show loading component
    this.loading = true;
    this.paymentService.completePayment(
      this.paymentId,
      this.payerId)
      .subscribe((response: any) => {
        console.log(response);
        if (response.status.localeCompare('success') === 0) {
          // show success message to user
          this.isPaymentSuccessfully = true;
          // add to product order table on server
          this.addToProductOrder();
        } else {
          // show error message to user
          this.isPaymentSuccessfully = false;
          // clear current user from local storage
          localStorage.removeItem(Config.currentUserProfile);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * add to product order
   */
  private addToProductOrder() {
    // show loading component
    this.loading = true;
    // create new product's order object
    const newProductOrder = new ProductOrder();
    newProductOrder.productOrderDate = new Date();
    newProductOrder.productOrderStatus = 1;
    newProductOrder.userProfile = this.selectedUserProfile;

    // add new product's order to server
    this.productOrderService.addProductOrder(newProductOrder)
      .subscribe(insertedProductOrder => {
        if (insertedProductOrder) {
          console.log(insertedProductOrder);
          // add each product to product's order detail
          this.addProductDetails(insertedProductOrder);
        } else {
          // show error message to user
          this.isPaymentSuccessfully = false;
          // clear current user profile from local storage
          localStorage.removeItem(Config.currentUserProfile);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   *
   * @param insertedProductOrder - inserted product's order
   */
  private addProductDetails(insertedProductOrder: ProductOrder) {
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
          console.log(insertedProductOrderDetails);
          // add to product payment table
          this.addProductPaymentToServer(insertedProductOrder);
        } else {
          // show error message to user
          this.isPaymentSuccessfully = false;
          // clear user profile from local storage
          localStorage.removeItem(Config.currentUserProfile);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * add to product payment server
   */
  private addProductPaymentToServer(insertedProductOrder: ProductOrder) {
    // show loading component
    this.loading = true;
    // create product payment object
    const productPayment = new ProductPayment();
    productPayment.createdDate = new Date();
    productPayment.payerId = this.payerId;
    productPayment.paymentId = this.paymentId;
    productPayment.token = this.token;
    productPayment.productOrder = insertedProductOrder;

    // add product payment to ser
    this.productPaymentService.addProductPayment(productPayment)
      .subscribe((insertedProductPayment: ProductPayment) => {
        if (insertedProductPayment) {
          // create coffeti object
          const coffeti = new Coffeti();
          this.coffetiInterval = setInterval(() => {
            coffeti.shoot();
          }, 1000);
          // show success message to user
          this.isPaymentSuccessfully = true;
          // clear user profile from local storage
          localStorage.removeItem(Config.currentUserProfile);
        } else {
          // show error message to user
          this.isPaymentSuccessfully = false;
          // clear user profile from local storage
          localStorage.removeItem(Config.currentUserProfile);
        }
      });
  }

  /**
   * go to feed
   */
  private goToFeed() {
    // clear coach membership notification
    localStorage.removeItem(Config.currentCoachMembershipNotification);
    // remove user profile from local storage
    localStorage.removeItem(Config.currentUserProfile);
    // remove current coach from local storage
    localStorage.removeItem(Config.currentCoach);
    // clear coffeti interval
    clearInterval(this.coffetiInterval);
    // redirect to client new feed page
    this.router.navigate(['/client/feed']);
  }
}
