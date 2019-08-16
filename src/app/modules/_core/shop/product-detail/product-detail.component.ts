import {Component, OnInit} from '@angular/core';
import {
  Product,
  ProductFeedback,
  ProductFeedbackReaction,
  ProductRate,
  ReplyOnProductFeedback, ReplyOnProductFeedbackReaction,
  ShoppingCart,
  UserProfile
} from '@gw-models/core';
import {ShareProductService} from '@gw-services/core/shared/product/share-product.service';
import {Router} from '@angular/router';
import {ProductFeedbackService} from '@gw-services/core/api/product/product-feedback.service';
import {NzNotificationService} from 'ng-zorro-antd';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {ProductRateService} from '@gw-services/core/api/product/product-rate.service';
import {ReplyOnProductFeedbackService} from '@gw-services/core/api/product/reply-on-product-feedback.service';
import {ProductFeedbackReactionService} from '@gw-services/core/api/product/product-feedback-reaction.service';
import {ReplyOnProductFeedbackReactionService} from '@gw-services/core/api/product/reply-on-product-feedback-reaction.service';
import {Config} from '@gw-config/core';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  selectedProduct: Product;
  isLoadingSpinnerShown: boolean;
  productReviewContent: string;
  isProductReviewFormShown: boolean;
  productFeedbacks: ProductFeedback[];
  productFeedbacksTemp: ProductFeedback[];
  productFeedbacksPerPage: ProductFeedback[];
  currentProductFeedbacksPage: number;
  nProductFeedbacksPerPage: number;
  totalProductFeedbacks: number;
  selectedUserProfile: UserProfile;
  selectedProductRateValue: number;
  selectedProductQuantity: number;

  /**
   *
   * @param shareProductService - inject shareProductService
   * @param router - inject router
   * @param productFeedbackService - inject productFeedbackService
   * @param notification - inject notification
   * @param shareUserProfileService - inject shareUserProfileService
   * @param productRateService - inject productRateService
   * @param replyOnProductFeedbackService - inject replyOnProductFeedbackService
   * @param productFeedbackReactionService - inject productFeedbackReactionService
   * @param replyOnProductFeedbackReactionService - inject replyOnProductFeedbackReactionService
   */
  constructor(private shareProductService: ShareProductService,
              private router: Router,
              private productFeedbackService: ProductFeedbackService,
              private notification: NzNotificationService,
              private shareUserProfileService: ShareUserProfileService,
              private productRateService: ProductRateService,
              private replyOnProductFeedbackService: ReplyOnProductFeedbackService,
              private productFeedbackReactionService: ProductFeedbackReactionService,
              private replyOnProductFeedbackReactionService: ReplyOnProductFeedbackReactionService) {
  }

  ngOnInit(): void {
    this.initData();
    this.getSelectedProduct();
    this.getSelectedUserProfile();
    this.getSelectedProductRate();
  }

  /**
   * init data
   */
  private initData(): void {
    this.selectedProductQuantity = 1;
    this.currentProductFeedbacksPage = 1;
    this.nProductFeedbacksPerPage = 8;
  }

  /**
   * get selected product
   */
  private getSelectedProduct(): void {
    this.isLoadingSpinnerShown = true;
    this.shareProductService.currentProduct
      .subscribe(selectedProduct => {
        if (selectedProduct) {
          this.selectedProduct = selectedProduct;
          this.getProductFeedbacksByProduct();
        } else {
          this.router.navigate(['/shop/home']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get selected user's profile
   */
  private getSelectedUserProfile(): void {
    this.isLoadingSpinnerShown = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
        } else {
          this.router.navigate(['/shop/home']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get selected's product rate
   */
  private getSelectedProductRate(): void {
    this.isLoadingSpinnerShown = true;
    const selectedUserProfileId = this.selectedUserProfile.id;
    const selectedProductId = this.selectedProduct.id;
    const getProductRateUrl = `${Config.apiBaseUrl}/
${Config.apiProductManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiProducts}/
${selectedProductId}/
${Config.apiProductRates}`;
    this.productRateService.getProductRate(getProductRateUrl)
      .subscribe((selectedProductRate: ProductRate) => {
        if (selectedProductRate) {
          this.selectedProductRateValue = selectedProductRate.rate;
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * toggle add review form
   */
  public toggleAddReviewForm(): void {
    this.isProductReviewFormShown = !this.isProductReviewFormShown;
  }

  /**
   * get product's feedbacks by product
   */
  private getProductFeedbacksByProduct(): void {
    this.isLoadingSpinnerShown = true;
    const selectedProductId = this.selectedProduct.id;
    const productFeedbackStatus = 1;
    const getProductFeedbacksUrl = `${Config.apiBaseUrl}/
${Config.apiProductManagementPrefix}/
${Config.apiProducts}/
${selectedProductId}/
${Config.apiProductFeedbacks}?
${Config.statusParameter}=${productFeedbackStatus}`;
    this.productFeedbackService.getProductFeedbacks(getProductFeedbacksUrl)
      .subscribe(productFeedbacks => {
        if (productFeedbacks && productFeedbacks.length > 0) {
          this.productFeedbacks = productFeedbacks;
          this.productFeedbacksTemp = productFeedbacks;
          this.totalProductFeedbacks = this.productFeedbacksTemp.length;
          this.getProductFeedbacksPerPage();
        } else {
          this.productFeedbacks = [];
          this.productFeedbacksPerPage = [];
          this.productFeedbacksTemp = [];
          this.totalProductFeedbacks = 0;
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param event - current's page
   */
  public productFeedbacksPageChange(event): void {
    this.currentProductFeedbacksPage = event;
    this.isLoadingSpinnerShown = true;
    this.getProductFeedbacksPerPage();
  }

  /**
   * load product's feedbacks per page
   */
  private getProductFeedbacksPerPage(): void {
    const startIndex = ((this.currentProductFeedbacksPage - 1) * 8) + 1;
    this.productFeedbacksPerPage = this.productFeedbacksTemp.slice(startIndex - 1, startIndex + 7);
    this.isLoadingSpinnerShown = false;
    this.getProductFeedbackReactionsByUser();
  }

  /**
   * get product's feedback that user liked or disliked
   */
  private getProductFeedbackReactionsByUser(): void {
    const selectedUserProfileId = this.selectedUserProfile.id;
    const getProductFeedbackReactionsUrl = `${Config.apiBaseUrl}/
${Config.apiProductManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiProductFeedbackReactions}`;
    this.productFeedbackReactionService.getProductFeedbackReactions(getProductFeedbackReactionsUrl)
      .subscribe((productFeedbackReactions: ProductFeedbackReaction[]) => {
        if (productFeedbackReactions) {
          this.showProductFeedbacksUserLikedDisliked(productFeedbackReactions);
        }
      });
  }

  /**
   *
   * @param productFeedbackReactions - product's feedbacks that user liked and disliked
   */
  private showProductFeedbacksUserLikedDisliked(productFeedbackReactions: ProductFeedbackReaction[]): void {
    for (const eachProductFeedbackReaction of productFeedbackReactions) {
      for (const eachProductFeedback of this.productFeedbacksPerPage) {
        if (eachProductFeedbackReaction.productFeedback.id === eachProductFeedback.id) {
          this.changeProductFeedbackReactionStatus(eachProductFeedback, eachProductFeedbackReaction);
          break;
        }
      }
    }
  }

  /**
   *
   * @param selectedProductFeedback - selected product's feedback that user liked and disliked
   * @param selectedProductFeedbackReaction - reaction's value that user has reacted to selected products' feedback
   */
  private changeProductFeedbackReactionStatus(selectedProductFeedback: ProductFeedback,
                                              selectedProductFeedbackReaction: ProductFeedbackReaction): void {
    selectedProductFeedback.isReacted = true;
    if (selectedProductFeedbackReaction.reaction === 1) {
      selectedProductFeedback.isLikeClicked = true;
    } else if (selectedProductFeedbackReaction.reaction === 0) {
      selectedProductFeedback.isLikeClicked = false;
    }
  }

  /**
   * add product's feedback for selected product
   */
  public addProductReview(): void {
    this.addProductFeedback();
    this.addProductRate();
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
   * @param event - rate value
   */
  public onRateChanged(event): void {
    this.selectedProductRateValue = event;
  }

  /**
   * add product's feedback
   */
  private addProductFeedback(): void {
    if (this.productReviewContent.localeCompare('') === 0) {
      this.createNotification('error', 'Error', 'Please input your review\'s content');
    } else {
      const productFeedback = new ProductFeedback();
      productFeedback.feedbackContent = this.productReviewContent;
      productFeedback.feedbackCreatedDate = new Date();
      productFeedback.feedbackStatus = 1;
      productFeedback.product = this.selectedProduct;
      productFeedback.userProfile = this.selectedUserProfile;
      productFeedback.numberOfLikes = 0;
      productFeedback.numberOfDislikes = 0;
      productFeedback.numberOfReplies = 0;
      this.addNewProductFeedbackOnClient(productFeedback);
      this.addNewProductFeedbackToServer(productFeedback);
    }
  }

  /**
   *
   * @param productFeedback - selected product's feedback
   *
   */
  private addNewProductFeedbackOnClient(productFeedback: ProductFeedback): void {
    this.productFeedbacks.push(productFeedback);
    this.productFeedbacksTemp = this.productFeedbacks;
    this.totalProductFeedbacks = this.productFeedbacksTemp.length;
    if (this.productFeedbacksPerPage.length < 8) {
      this.productFeedbacksPerPage.push(productFeedback);
    }
  }

  /**
   *
   * @param productFeedback - product's feedback that will be added
   */
  private addNewProductFeedbackToServer(productFeedback: ProductFeedback): void {
    const addProductFeedbackUrl = `${Config.apiBaseUrl}/${Config.apiProductManagementPrefix}/${Config.apiProductFeedbacks}`;
    this.productFeedbackService.addProductFeedback(addProductFeedbackUrl, productFeedback)
      .subscribe((insertedProductFeedback: ProductFeedback) => {
        if (insertedProductFeedback) {
          this.productReviewContent = '';
          this.createNotification('success', 'Success', 'Thank your for your feedback!!!');
        } else {
          this.createNotification('error', 'Error', 'Cannot submit your feedback! Please try again!');
        }
      });
  }

  /**
   * add product's rate
   */
  private addProductRate(): void {
    const productRate = new ProductRate();
    productRate.rate = this.selectedProductRateValue;
    productRate.product = this.selectedProduct;
    productRate.userProfile = this.selectedUserProfile;
    const addProductRateUrl = `${Config.apiBaseUrl}/${Config.apiProductManagementPrefix}/${Config.apiProductRates}`;
    this.productRateService.addProductRate(addProductRateUrl, productRate)
      .subscribe((insertedProductRate: ProductRate) => {
        if (insertedProductRate) {
          this.selectedProductRateValue = insertedProductRate.rate;
        }
      });
  }

  /**
   *
   * @param selectedProductFeedback - selected product's feedback that user want to like
   */
  public like(selectedProductFeedback: ProductFeedback): void {
    if (selectedProductFeedback.isLikeClicked === true) {
      return;
    }
    if (selectedProductFeedback.numberOfDislikes > 0 && selectedProductFeedback.isReacted) {
      selectedProductFeedback.numberOfDislikes -= 1;
    }
    selectedProductFeedback.numberOfLikes += 1;
    selectedProductFeedback.isLikeClicked = true;
    selectedProductFeedback.isReacted = true;
    // update number of likes of selected product's feedback
    this.updateProductFeedback(selectedProductFeedback);
    this.submitNewProductFeedbackReaction(selectedProductFeedback, 1);
  }

  /**
   *
   * @param selectedProductFeedback - selected product's feedback that user wants to dislike
   */
  public dislike(selectedProductFeedback: ProductFeedback): void {
    if (selectedProductFeedback.isLikeClicked === false) {
      return;
    }
    if (selectedProductFeedback.numberOfLikes > 0 && selectedProductFeedback.isReacted) {
      selectedProductFeedback.numberOfLikes -= 1;
    }
    selectedProductFeedback.numberOfDislikes += 1;
    selectedProductFeedback.isLikeClicked = false;
    selectedProductFeedback.isReacted = true;
    // update number of dislikes of selected product's feedback
    this.updateProductFeedback(selectedProductFeedback);
    this.submitNewProductFeedbackReaction(selectedProductFeedback, 0);
  }

  /**
   *
   * @param selectedProductFeedback - product's feedback that will be updated
   */
  private updateProductFeedback(selectedProductFeedback: ProductFeedback): void {
    const updateProductFeedbackUrl = `${Config.apiBaseUrl}/${Config.apiProductManagementPrefix}/${Config.apiProductFeedbacks}`;
    this.productFeedbackService.updateProductFeedback(updateProductFeedbackUrl, selectedProductFeedback)
      .subscribe((updatedProductFeedback: ProductFeedback) => {
        console.log(updatedProductFeedback);
      });
  }

  /**
   *
   * @param selectedProductFeedback - selected product's feedback that user want to like or dislike
   * @param reactionValue - reaction's value that will be set to selected product's feedback
   */
  private submitNewProductFeedbackReaction(selectedProductFeedback: ProductFeedback, reactionValue: number): void {
    const newProductFeedbackReaction = new ProductFeedbackReaction();
    newProductFeedbackReaction.productFeedback = selectedProductFeedback;
    newProductFeedbackReaction.userProfile = this.selectedUserProfile;
    newProductFeedbackReaction.reaction = reactionValue;
    const addProductFeedbackReactionUrl = `${Config.apiBaseUrl}/${Config.apiProductManagementPrefix}/${Config.apiProductFeedbackReactions}`;
    this.productFeedbackReactionService.addNewProductFeedbackReaction(addProductFeedbackReactionUrl, newProductFeedbackReaction)
      .subscribe((insertedProductFeedbackReaction: ProductFeedbackReaction) => {
        if (insertedProductFeedbackReaction) {
          console.log(insertedProductFeedbackReaction);
        }
      });
  }

  /**
   *
   * @param selectedProductFeedback - selected product's feedback that user want to view replies
   */
  public viewRepliesOfSelectedProductFeedback(selectedProductFeedback: ProductFeedback): void {
    if (!selectedProductFeedback.replies) {
      const replyOnProductFeedbackStatus = 1;
      const getRepliesOnProductFeedbackUrl = `${Config.apiBaseUrl}/
${Config.apiProductManagementPrefix}/
${Config.apiProductFeedbacks}/
${selectedProductFeedback.id}/
${Config.apiRepliesOnProductFeedback}?
${Config.statusParameter}=${replyOnProductFeedbackStatus}`;
      this.replyOnProductFeedbackService.getRepliesOnProductFeedback(getRepliesOnProductFeedbackUrl)
        .subscribe((repliesOnProductFeedback: ReplyOnProductFeedback[]) => {
          if (repliesOnProductFeedback) {
            selectedProductFeedback.replies = repliesOnProductFeedback;
            this.getReplyOnProductFeedbackReactionsByUser(selectedProductFeedback);
          }
        });
    }
  }

  /**
   * check which reply on product's feedback that current user liked and disliked
   */
  private getReplyOnProductFeedbackReactionsByUser(selectedProductFeedback: ProductFeedback): void {
    const selectedUserProfileId = this.selectedUserProfile.id;
    const getReplyOnProductFeedbackReactionsUrl = `${Config.apiBaseUrl}/
${Config.apiProductManagementPrefix}/
${Config.apiUsers}/
${selectedUserProfileId}/
${Config.apiReplyOnProductFeedbackReaction}`;
    this.replyOnProductFeedbackReactionService.getReplyOnProductFeedbackReactions(getReplyOnProductFeedbackReactionsUrl)
      .subscribe((replyOnProductFeedbackReactions: ReplyOnProductFeedbackReaction[]) => {
        if (replyOnProductFeedbackReactions) {
          this.showReplyOnProductFeedbacksUserLikedDisliked(selectedProductFeedback.replies, replyOnProductFeedbackReactions);
        }
      });
  }

  /**
   *
   * @param repliesOnProductFeedback - replies on product's feedback that will be checked which replies that user liked and disliked
   * @param replyOnProductFeedbackReactions - replies on product's feedback that user liked and disliked
   */
  private showReplyOnProductFeedbacksUserLikedDisliked(repliesOnProductFeedback: ReplyOnProductFeedback[],
                                                       replyOnProductFeedbackReactions: ReplyOnProductFeedbackReaction[]): void {
    for (const eachReplyOnProductFeedbackReaction of replyOnProductFeedbackReactions) {
      for (const eachReplyOnProductFeedback of repliesOnProductFeedback) {
        if (eachReplyOnProductFeedbackReaction.replyOnProductFeedback.id === eachReplyOnProductFeedback.id) {
          this.changeReplyOnProductFeedbackReactionStatus(eachReplyOnProductFeedback, eachReplyOnProductFeedbackReaction);
          break;
        }
      }
    }
  }

  /**
   *
   * @param selectedReplyOnProductFeedback - reply on product's feedback that its reaction will be changed
   * @param selectedReplyOnProductFeedbackReacton - reaction's value that will be set to selected reply on product's feedback
   */
  private changeReplyOnProductFeedbackReactionStatus(selectedReplyOnProductFeedback: ReplyOnProductFeedback,
                                                     selectedReplyOnProductFeedbackReacton: ReplyOnProductFeedbackReaction): void {
    selectedReplyOnProductFeedback.isReacted = true;
    if (selectedReplyOnProductFeedbackReacton.reaction === 1) {
      selectedReplyOnProductFeedback.isLikeClicked = true;
    } else if (selectedReplyOnProductFeedbackReacton.reaction === 0) {
      selectedReplyOnProductFeedback.isLikeClicked = false;
    }
  }

  /**
   *
   * @param selectedReplyOnProductFeedback - selectedReplyOnProductFeedback
   */
  public likeReplyOnProductFeedback(selectedReplyOnProductFeedback: ReplyOnProductFeedback): void {
    if (selectedReplyOnProductFeedback.isLikeClicked === true) {
      return;
    }
    if (selectedReplyOnProductFeedback.numberOfDislikes > 0 && selectedReplyOnProductFeedback.isReacted) {
      selectedReplyOnProductFeedback.numberOfDislikes -= 1;
    }
    selectedReplyOnProductFeedback.numberOfLikes += 1;
    selectedReplyOnProductFeedback.isLikeClicked = true;
    selectedReplyOnProductFeedback.isReacted = true;
    // update number of likes of reply on product's feedback
    this.updateReplyOnProductFeedback(selectedReplyOnProductFeedback);
    this.submitNewReplyProductFeedbackReaction(selectedReplyOnProductFeedback, 1);
  }

  /**
   *
   * @param selectedReplyOnProductFeedback - selectedReplyOnProductFeedback
   */
  public dislikeReplyOnProductFeedback(selectedReplyOnProductFeedback: ReplyOnProductFeedback): void {
    if (selectedReplyOnProductFeedback.isLikeClicked === false) {
      return;
    }
    if (selectedReplyOnProductFeedback.numberOfLikes > 0 && selectedReplyOnProductFeedback.isReacted) {
      selectedReplyOnProductFeedback.numberOfLikes -= 1;
    }
    selectedReplyOnProductFeedback.numberOfDislikes += 1;
    selectedReplyOnProductFeedback.isLikeClicked = false;
    selectedReplyOnProductFeedback.isReacted = true;
    // update number of dislikes of reply on product's feedback
    this.updateReplyOnProductFeedback(selectedReplyOnProductFeedback);
    this.submitNewReplyProductFeedbackReaction(selectedReplyOnProductFeedback, 0);
  }

  private updateReplyOnProductFeedback(selectedReplyOnProductFeedback: ReplyOnProductFeedback): void {
    const updateReplyOnProductFeedbackUrl = `${Config.apiBaseUrl}/
${Config.apiProductManagementPrefix}/
${Config.apiRepliesOnProductFeedback}`;
    this.replyOnProductFeedbackService.updateReplyOnProductFeedback(updateReplyOnProductFeedbackUrl, selectedReplyOnProductFeedback)
      .subscribe((updatedReplyOnProductFeedback: ReplyOnProductFeedback) => {
        console.log(updatedReplyOnProductFeedback);
      });
  }

  /**
   *
   * @param selectedReplyOnProductFeedback - selected reply on product feedback
   * @param reactionValue - reaction's value
   */
  private submitNewReplyProductFeedbackReaction(selectedReplyOnProductFeedback, reactionValue): void {
    // create new reply on product feedback reaction object
    const newReplyOnProductFeedbackReaction = new ReplyOnProductFeedbackReaction();
    newReplyOnProductFeedbackReaction.replyOnProductFeedback = selectedReplyOnProductFeedback;
    newReplyOnProductFeedbackReaction.userProfile = this.selectedUserProfile;
    newReplyOnProductFeedbackReaction.reaction = reactionValue;
    const addReplyProductFeedbackReactionUrl = `${Config.apiBaseUrl}/
${Config.apiProductManagementPrefix}/
${Config.apiReplyOnProductFeedbackReaction}`;
    this.replyOnProductFeedbackReactionService
      .addReplyOnProductFeedbackReaction(addReplyProductFeedbackReactionUrl, newReplyOnProductFeedbackReaction)
      .subscribe((insertedReplyOnProductFeedbackReaction: ReplyOnProductFeedbackReaction) => {
        if (insertedReplyOnProductFeedbackReaction) {
          console.log(insertedReplyOnProductFeedbackReaction);
        }
      });
  }

  /**
   *
   * @param selectedComment - selected comment that user want to reply
   */
  public showReplyProductFeedbackBox(selectedComment): void {
    selectedComment.isReplyBoxShown = true;
  }

  public showReplyReplyProductFeedbackBox(selectedReplyComment): void {
    // find product's feedback and show reply box
    for (const eachProductFeedback of this.productFeedbacksPerPage) {
      if (selectedReplyComment.productFeedback.id === eachProductFeedback.id) {
        eachProductFeedback.isReplyBoxShown = true;
        break;
      }
    }
  }

  /**
   *
   * @param replyContent - reply's content that user want to reply to selected product's feedback
   * @param selectedProductFeedback - selected product's feedback that user want to reply
   */
  public replyToProductFeedback(selectedProductFeedback: ProductFeedback, replyContent: string): void {
    const newReplyOnProductFeedback = new ReplyOnProductFeedback();
    newReplyOnProductFeedback.replyOnProductFeedbackContent = replyContent;
    newReplyOnProductFeedback.replyOnProductFeedbackStatus = 1;
    newReplyOnProductFeedback.replyOnProductFeedbackCreateDate = new Date();
    newReplyOnProductFeedback.productFeedback = selectedProductFeedback;
    newReplyOnProductFeedback.userProfile = this.selectedUserProfile;
    newReplyOnProductFeedback.numberOfLikes = 0;
    newReplyOnProductFeedback.numberOfDislikes = 0;
    const addReplyOnProductFeedbackUrl = `${Config.apiBaseUrl}/${Config.apiProductManagementPrefix}/${Config.apiRepliesOnProductFeedback}`;
    this.replyOnProductFeedbackService.addReplyOnProductFeedback(addReplyOnProductFeedbackUrl, newReplyOnProductFeedback)
      .subscribe((insertedReplyOnProductFeedback: ReplyOnProductFeedback) => {
        if (insertedReplyOnProductFeedback) {
          console.log(insertedReplyOnProductFeedback);
        }
      });
    if (selectedProductFeedback.replies && selectedProductFeedback.replies.length) {
      selectedProductFeedback.replies.push(newReplyOnProductFeedback);
    }
    selectedProductFeedback.numberOfReplies += 1;
  }

  /**
   * add product to cart
   */
  public addProductToCart(): void {
    if (this.selectedProductQuantity > this.selectedProduct.productQuantity) {
      this.createNotification('error', 'Error', 'Sorry! Your product\'s quantity is exceed number of products in the storage');
      return;
    }
    if (localStorage.getItem(Config.shoppingCart)) {
      const currentShoppingCart = JSON.parse(localStorage.getItem(Config.shoppingCart));
      this.addProductToShoppingCart(currentShoppingCart);
    } else {
      this.initShoppingCart();
    }
  }

  /**
   *
   * @param currentShoppingCart - current shopping cart
   */
  private addProductToShoppingCart(currentShoppingCart: any): void {
    let isProductExistedInCurrentShoppingCart = false;
    for (const eachProductShoppingCart of currentShoppingCart) {
      if (eachProductShoppingCart.product.id === this.selectedProduct.id) {
        eachProductShoppingCart.quantity += this.selectedProductQuantity;
        isProductExistedInCurrentShoppingCart = true;
        break;
      }
    }
    if (!isProductExistedInCurrentShoppingCart) {
      const productShoppingCart = new ShoppingCart();
      productShoppingCart.product = this.selectedProduct;
      productShoppingCart.quantity = this.selectedProductQuantity;
      currentShoppingCart.push(productShoppingCart);
    }
    localStorage.setItem(Config.shoppingCart, JSON.stringify(currentShoppingCart));
    this.createNotification('success', 'Success', `${this.selectedProduct.productName} was added to cart successfully`);
  }

  /**
   * init shopping cart
   */
  private initShoppingCart(): void {
    const currentShoppingCart = [];
    const newProductShoppingCart = new ShoppingCart();
    newProductShoppingCart.quantity = 1;
    newProductShoppingCart.product = this.selectedProduct;
    currentShoppingCart.push(newProductShoppingCart);
    localStorage.setItem(Config.shoppingCart, JSON.stringify(currentShoppingCart));
    this.createNotification('success', 'Success', `${this.selectedProduct.productName} was added to cart successfully`);
  }
}
