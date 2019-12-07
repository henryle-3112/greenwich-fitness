import {Component, OnInit} from '@angular/core';
import {
  ChatRoomService,
  CoachMembershipNotificationService,
  CoachPaymentService,
  CoachRateService,
  MembershipService,
  NotificationService,
  ParticipantService,
  PaymentService,
  ProductOrderDetailService,
  ProductOrderService,
  ProductPaymentService
} from '@gw-services/api';
import {Config} from '@gw-config';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ChatRoom,
  Coach,
  CoachMembershipNotification,
  CoachPayment,
  Coffeti,
  Membership,
  Notification,
  Participant,
  ProductOrder,
  ProductOrderDetail,
  ProductPayment,
  ShoppingCart,
  UserProfile
} from '@gw-models';

@Component({
  selector: 'app-payment-alert',
  templateUrl: './payment-alert.component.html',
  styleUrls: ['./payment-alert.component.css']
})
export class PaymentAlertComponent implements OnInit {
  isLoadingSpinnerShown: boolean;
  isPaymentSuccessfully: boolean;
  checkWhatUserWantToPay: string;
  paymentId: string;
  payerId: string;
  paymentToken: string;
  shoppingCartProducts: ShoppingCart[];
  selectedUserProfile: UserProfile;
  totalShoppingCartPrice: number;
  coffetiAnimationInterval: any;
  selectedCoach: Coach;
  selectedCoachMembershipNotification: CoachMembershipNotification;
  totalCoachPayment: number;


  /**
   *
   * @param paymentService - inject paymentService
   * @param notificationService - inject notificationService
   * @param productPaymentService - inject productPaymentService
   * @param coachMembershipNotificationService - inject coachMembershipNotificationService
   * @param coachPaymentService - inject coachPaymentService
   * @param coachRateService - inject coachRateService
   * @param membershipService - inject membershipService
   * @param router - inject router
   * @param route - inject route
   * @param productOrderService - inject productOrderService
   * @param productOrderDetailService - inject productOrderDetailService
   * @param chatRoomService - inject chatRoomService
   * @param participantService - inject participantService
   */
  constructor(private paymentService: PaymentService,
              private notificationService: NotificationService,
              private productPaymentService: ProductPaymentService,
              private coachMembershipNotificationService: CoachMembershipNotificationService,
              private coachPaymentService: CoachPaymentService,
              private coachRateService: CoachRateService,
              private membershipService: MembershipService,
              private router: Router,
              private route: ActivatedRoute,
              private productOrderService: ProductOrderService,
              private productOrderDetailService: ProductOrderDetailService,
              private chatRoomService: ChatRoomService,
              private participantService: ParticipantService) {
    this.route.queryParams.subscribe(params => {
      this.paymentId = params['paymentId'];
      this.payerId = params['PayerID'];
      this.paymentToken = params['token'];
    });
  }

  ngOnInit(): void {
    const isPaymentParametersNotExisted = typeof this.paymentId === 'undefined' ||
      typeof this.payerId === 'undefined' ||
      typeof this.paymentToken === 'undefined';
    if (isPaymentParametersNotExisted) {
      this.router.navigate(['/client/feed']);
    } else {
      if (localStorage.getItem(Config.checkWhatUserWantToPay)) {
        this.getSelectedUserProfile();
        this.checkWhatUserWantToBuy();
      } else {
        this.router.navigate(['/client/feed']);
      }
    }
  }

  /**
   * check what user want to buy
   */
  private checkWhatUserWantToBuy(): void {
    this.checkWhatUserWantToPay = localStorage.getItem(Config.checkWhatUserWantToPay);
    if (this.checkWhatUserWantToPay.localeCompare('product') === 0) {
      this.getProductsFromShoppingCart();
    } else if (this.checkWhatUserWantToPay.localeCompare('coach') === 0) {
      this.getSelectedCoach();
    }
  }

  /**
   * get selected coach
   */
  private getSelectedCoach(): void {
    if (localStorage.getItem(Config.currentCoach)) {
      this.selectedCoach = JSON.parse(localStorage.getItem(Config.currentCoach));
      this.getTotalCoachPayment();
      this.getSelectedCoachMembershipNotification();
    } else {
      this.removeDataFromLocalStorage();
      this.router.navigate(['/client/feed']);
    }
  }

  /**
   * get total coach payment
   */
  private getTotalCoachPayment(): void {
    if (localStorage.getItem(Config.totalCoachPayment)) {
      this.totalCoachPayment = Number(localStorage.getItem(Config.totalCoachPayment));
    } else {
      this.removeDataFromLocalStorage();
      this.router.navigate(['/client/feed']);
    }
  }

  /**
   * get selected coach membership notification
   */
  private getSelectedCoachMembershipNotification(): void {
    if (localStorage.getItem(Config.currentCoachMembershipNotification)) {
      this.selectedCoachMembershipNotification = JSON.parse(localStorage.getItem(Config.currentCoachMembershipNotification));
      this.callCompleteCoachPayment();
    } else {
      this.removeDataFromLocalStorage();
      this.router.navigate(['/client/feed']);
    }
  }

  /**
   * call complete coach payment
   */
  private callCompleteCoachPayment(): void {
    this.isLoadingSpinnerShown = true;
    const completePaymentUrl = `${Config.apiBaseUrl}/
${Config.apiPaypalManagementPrefix}/
${Config.apiCompletePayment}?
${Config.paymentIdParameter}=${this.paymentId}&
${Config.payerIdParameter}=${this.payerId}`;
    this.paymentService.completePayment(completePaymentUrl)
      .subscribe((response: any) => {
        if (response && response.status.localeCompare('success') === 0) {
          this.addMembership();
        } else {
          this.isPaymentSuccessfully = false;
          this.removeDataFromLocalStorage();
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * add membership
   */
  private addMembership(): void {
    this.isLoadingSpinnerShown = true;
    const selectedUserProfileId = this.selectedUserProfile.id;
    const selectedCoachId = this.selectedCoach.id;
    const getMembershipUrl = `${Config.apiBaseUrl}/
${Config.apiMembershipManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiCoaches}/
${selectedCoachId}/
${Config.apiMemberships}`;
    this.membershipService.getMembership(getMembershipUrl)
      .subscribe((selectedMembership: Membership) => {
        if (selectedMembership) {
          selectedMembership.status = 1;
          selectedMembership.startDate = new Date();
          this.updateMembership(selectedMembership);
        } else {
          this.addMembershipToServer();
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param selectedMembership - selected membership that user want to update
   */
  private updateMembership(selectedMembership: Membership): void {
    this.isLoadingSpinnerShown = true;
    const updateMembershipUrl = `${Config.apiBaseUrl}/${Config.apiMembershipManagementPrefix}/${Config.apiMemberships}`;
    this.membershipService.updateMembership(updateMembershipUrl, selectedMembership)
      .subscribe((updatedMembership: Membership) => {
        if (updatedMembership) {
          this.addCoachPaymentToServer(updatedMembership);
        } else {
          this.isPaymentSuccessfully = false;
          this.removeDataFromLocalStorage();
        }
      });
  }

  /**
   * add membership to server
   */
  private addMembershipToServer(): void {
    this.isLoadingSpinnerShown = true;
    const membership = new Membership();
    membership.userProfile = this.selectedUserProfile;
    membership.coach = this.selectedCoach;
    membership.status = 1;
    membership.startDate = new Date();
    const addMembershipUrl = `${Config.apiBaseUrl}/${Config.apiMembershipManagementPrefix}/${Config.apiMemberships}`;
    this.membershipService.addMembership(addMembershipUrl, membership)
      .subscribe((insertedMembership: Membership) => {
        if (insertedMembership) {
          this.addCoachPaymentToServer(insertedMembership);
        } else {
          this.isPaymentSuccessfully = false;
          this.removeDataFromLocalStorage();
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * add coach payment to server
   */
  private addCoachPaymentToServer(insertedMembership: Membership): void {
    this.isLoadingSpinnerShown = true;
    const coachPayment = new CoachPayment();
    coachPayment.createdDate = new Date();
    coachPayment.membership = insertedMembership;
    coachPayment.payerId = this.payerId;
    coachPayment.paymentId = this.paymentId;
    coachPayment.token = this.paymentToken;
    coachPayment.sum = this.totalCoachPayment;
    const addCoachPaymentUrl = `${Config.apiBaseUrl}/${Config.apiPaymentManagementPrefix}/${Config.apiCoachesPayment}`;
    this.coachPaymentService.addCoachPayment(addCoachPaymentUrl, coachPayment)
      .subscribe((insertedCoachPayment: CoachPayment) => {
        if (insertedCoachPayment) {
          this.updateCoachMembershipNotification();
          this.addChatRoom();
        } else {
          this.isPaymentSuccessfully = false;
          this.removeDataFromLocalStorage();
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * add chat's room betweencoach and user
   */
  private addChatRoom(): void {
    this.isLoadingSpinnerShown = true;
    const chatRoom = new ChatRoom();
    chatRoom.name = `${this.selectedCoach.userProfile.fullName} - ${this.selectedUserProfile.fullName}`;
    chatRoom.type = 1;
    const addChatRoomUrl = `${Config.apiBaseUrl}/${Config.apiChatManagementPrefix}/${Config.apiChatRooms}`;
    this.chatRoomService.addChatRoom(addChatRoomUrl, chatRoom)
      .subscribe((insertedChatRoom: ChatRoom) => {
        if (insertedChatRoom) {
          this.addParticipant(insertedChatRoom);
        } else {
          this.isPaymentSuccessfully = false;
          this.removeDataFromLocalStorage();
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param chatRoom - chat's room that will be used to add to participant
   */
  private addParticipant(chatRoom: ChatRoom): void {
    this.isLoadingSpinnerShown = true;
    const participant = new Participant();
    participant.chatRoom = chatRoom;
    participant.coach = this.selectedCoach;
    participant.userProfile = this.selectedUserProfile;
    const addParticipantUrl = `${Config.apiBaseUrl}/${Config.apiChatManagementPrefix}/${Config.apiParticipants}`;
    this.participantService.addParticipant(addParticipantUrl, participant)
      .subscribe((insertedParticipant) => {
        if (insertedParticipant) {
          this.showCoffetiAnimation();
          this.addNotificationForCoach();
          this.addNotificationForUser();
          this.isPaymentSuccessfully = true;
          this.removeDataFromLocalStorage();
        } else {
          this.isPaymentSuccessfully = false;
          this.removeDataFromLocalStorage();
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * show coffeti animation
   */
  private showCoffetiAnimation(): void {
    const coffeti = new Coffeti();
    this.coffetiAnimationInterval = setInterval(() => {
      coffeti.shoot();
    }, 1000);
  }

  /**
   * add notification for coach
   */
  private addNotificationForCoach(): void {
    const notification = new Notification();
    notification.userProfile = this.selectedCoach.userProfile;
    notification.createdDate = new Date();
    notification.status = 1;
    notification.content = `${this.selectedUserProfile.fullName} has pay ${this.totalCoachPayment}$ for you`;
    this.isLoadingSpinnerShown = true;
    const addNotificationUrl = `${Config.apiBaseUrl}/${Config.apiNotificationManagementPrefix}/${Config.apiNotifications}`;
    this.notificationService.addNotification(addNotificationUrl, notification)
      .subscribe(() => {
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * add notification for user
   */
  private addNotificationForUser(): void {
    const notification = new Notification();
    notification.userProfile = this.selectedUserProfile;
    notification.createdDate = new Date();
    notification.status = 1;
    notification.content = `You has pay ${this.totalCoachPayment}$ for ${this.selectedCoach.userProfile.fullName}`;
    this.isLoadingSpinnerShown = true;
    const addNotificationUrl = `${Config.apiBaseUrl}/${Config.apiNotificationManagementPrefix}/${Config.apiNotifications}`;
    this.notificationService.addNotification(addNotificationUrl, notification)
      .subscribe(() => {
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * update coach membership notification
   */
  private updateCoachMembershipNotification(): void {
    // status = 2. It means that user has pay
    this.selectedCoachMembershipNotification.status = 2;
    const updateCoachMembershipNotificationUrl = `${Config.apiBaseUrl}/
${Config.apiNotificationManagementPrefix}/
${Config.apiCoachMembershipNotifications}`;
    this.coachMembershipNotificationService
      .updateCoachMembershipNotification(updateCoachMembershipNotificationUrl, this.selectedCoachMembershipNotification)
      .subscribe();
  }

  /**
   * get selected user's profile
   */
  private getSelectedUserProfile(): void {
    if (localStorage.getItem(Config.currentUserProfile)) {
      this.selectedUserProfile = JSON.parse(localStorage.getItem(Config.currentUserProfile));
    } else {
      this.removeDataFromLocalStorage();
      this.router.navigate(['/client/feed']);
    }
  }

  /**
   * get products from shopping cart
   */
  private getProductsFromShoppingCart(): void {
    if (localStorage.getItem(Config.shoppingCart)) {
      this.totalShoppingCartPrice = 0;
      this.shoppingCartProducts = [];
      const currentShoppingCart = JSON.parse(localStorage.getItem(Config.shoppingCart));
      for (const eachShoppingCart of currentShoppingCart) {
        this.totalShoppingCartPrice = this.totalShoppingCartPrice + eachShoppingCart.product.productPrice * eachShoppingCart.quantity;
        this.shoppingCartProducts.push(eachShoppingCart);
      }
      this.callCompleteProductsPayment();
    } else {
      this.removeDataFromLocalStorage();
      this.router.navigate(['/client/feed']);
    }
  }

  /**
   * call complete payment method
   */
  private callCompleteProductsPayment(): void {
    this.isLoadingSpinnerShown = true;
    const completePaymentUrl = `${Config.apiBaseUrl}/
${Config.apiPaypalManagementPrefix}/
${Config.apiCompletePayment}?
${Config.paymentIdParameter}=${this.paymentId}&
${Config.payerIdParameter}=${this.payerId}`;
    this.paymentService.completePayment(completePaymentUrl)
      .subscribe((response: any) => {
        if (response.status.localeCompare('success') === 0) {
          this.isPaymentSuccessfully = true;
          this.addToProductOrder();
        } else {
          this.isPaymentSuccessfully = false;
          this.removeDataFromLocalStorage();
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * add to product order
   */
  private addToProductOrder(): void {
    this.isLoadingSpinnerShown = true;
    const newProductOrder = new ProductOrder();
    newProductOrder.productOrderDate = new Date();
    newProductOrder.productOrderStatus = 1;
    newProductOrder.userProfile = this.selectedUserProfile;
    const addProductOrderUrl = `${Config.apiBaseUrl}/${Config.apiProductManagementPrefix}/${Config.apiProductOrders}`;
    this.productOrderService.addProductOrder(addProductOrderUrl, newProductOrder)
      .subscribe(insertedProductOrder => {
        if (insertedProductOrder) {
          this.addProductDetails(insertedProductOrder);
        } else {
          this.isPaymentSuccessfully = false;
          this.removeDataFromLocalStorage();
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param insertedProductOrder - inserted product's order
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
    const addProductOrderDetailsUrl = `${Config.apiBaseUrl}/${Config.apiProductManagementPrefix}/${Config.apiProductOrderDetails}`;
    this.productOrderDetailService.addProductOrderDetails(addProductOrderDetailsUrl, productOrderDetails)
      .subscribe(insertedProductOrderDetails => {
        if (insertedProductOrderDetails) {
          this.addProductPaymentToServer(insertedProductOrder);
        } else {
          this.isPaymentSuccessfully = false;
          this.removeDataFromLocalStorage();
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * add to product payment server
   */
  private addProductPaymentToServer(insertedProductOrder: ProductOrder): void {
    this.isLoadingSpinnerShown = true;
    const productPayment = new ProductPayment();
    productPayment.createdDate = new Date();
    productPayment.payerId = this.payerId;
    productPayment.paymentId = this.paymentId;
    productPayment.token = this.paymentToken;
    productPayment.productOrder = insertedProductOrder;
    const addProductPaymentUrl = `${Config.apiBaseUrl}/${Config.apiPaymentManagementPrefix}/${Config.apiProductsPayment}`;
    this.productPaymentService.addProductPayment(addProductPaymentUrl, productPayment)
      .subscribe((insertedProductPayment: ProductPayment) => {
        if (insertedProductPayment) {
          this.showCoffetiAnimation();
          this.isPaymentSuccessfully = true;
          this.removeDataFromLocalStorage();
        } else {
          this.isPaymentSuccessfully = false;
          this.removeDataFromLocalStorage();
        }
      });
  }

  /**
   * remove data from local storage
   */
  private removeDataFromLocalStorage(): void {
    localStorage.removeItem(Config.totalCoachPayment);
    localStorage.removeItem(Config.currentCoachMembershipNotification);
    localStorage.removeItem(Config.currentCoach);
    localStorage.removeItem(Config.currentUserProfile);
  }

  /**
   * go to feed
   */
  private goToFeed(): void {
    this.removeDataFromLocalStorage();
    clearInterval(this.coffetiAnimationInterval);
    this.router.navigate(['/client/feed']);
  }
}
