import {Component, OnInit} from '@angular/core';
import {
  Product,
  ProductFeedback,
  ProductFeedbackReaction,
  ProductRate,
  ReplyOnProductFeedback, ReplyOnProductFeedbackReaction,
  ResponseMessage, ShoppingCart,
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

  // selected product that was chosen by user
  selectedProduct: Product;

  // check loading component is showing or not
  loading: boolean;

  // review's content
  reviewContent: string;

  // check add review form is showing or not
  isReviewFormShown: boolean;

  // product's feedbacks
  productFeedbacks: ProductFeedback[];

  // need to create product's feedbacks temp to load data base on current page
  productFeedbacksTemp: ProductFeedback[];

  // product's feedbacks per page
  productFeedbacksPerPage: ProductFeedback[];

  // current page
  currentPage: number;

  // number product's feedbacks per page
  nProductFeedbacksPerPage: number;

  // total product's feedbacks
  totalProductFeedbacks: number;

  // check product's feedback list and pagination is showing or not
  isProductFeedbacksAndPaginationShown: boolean;

  // startIndex to get product's feedbacks per page
  startIndex: number;

  // selected user's profile
  selectedUserProfile: UserProfile;

  // selected product's rate
  selectedProductRateValue: number;

  // selected product's rate
  selectedProductRate: ProductRate;

  // selected product's quantity
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

  ngOnInit() {
    // init data
    this.initData();
    // get selected product
    this.getSelectedProduct();
    // get selected user's profile
    this.getSelectedUserProfile();
    // get selected product's rate
    this.getSelectedProductRate();
  }

  /**
   * get selected product
   */
  private getSelectedProduct() {
    // show loading componnet
    this.loading = true;
    this.shareProductService.currentProduct
      .subscribe(selectedProduct => {
        // show loading component
        this.selectedProduct = selectedProduct;
        // check selected product existed or not
        this.checkSelectedProductExistedOrNot();
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * check selected product existed or not
   */
  private checkSelectedProductExistedOrNot() {
    if (this.selectedProduct == null) {
      // if selectedProduct is not existed, redirect to home page
      this.router.navigate(['/shop/home']);
    } else {
      // get feedback's products
      this.getProductFeedbacksByProduct();
    }
  }

  /**
   * toggle add review form
   */
  public toggleAddReviewForm() {
    this.isReviewFormShown = !this.isReviewFormShown;
  }

  /**
   * get product's feedbacks by product
   */
  private getProductFeedbacksByProduct() {
    // show loading component
    this.loading = true;
    // get product's feedbacks
    this.productFeedbackService.getProductFeedbacksByProduct(this.selectedProduct, 1)
      .subscribe(productFeedbacks => {
        if (productFeedbacks) {
          // check product's feedbacks list and pagination is showing or not
          if (productFeedbacks.length > 0) {
            // get product's feedbacks
            this.productFeedbacks = productFeedbacks;
            // assign all data to product's feedbacks temp the first time
            this.productFeedbacksTemp = productFeedbacks;
            // get total number of product's feedbacks
            this.totalProductFeedbacks = this.productFeedbacksTemp.length;
            // load product's feedbacks per page
            this.loadProductFeedbacksPerPage();
            //
            this.isProductFeedbacksAndPaginationShown = true;
          } else {
            this.isProductFeedbacksAndPaginationShown = false;
            // init product feedback
            this.productFeedbacks = [];
            this.productFeedbacksPerPage = [];
            this.productFeedbacksTemp = [];
            this.totalProductFeedbacks = 0;
          }
          // hide loading component
          this.loading = false;
        }
      });
  }

  /**
   *
   * @param event - current's page
   */
  public productFeedbacksPageChange(event) {
    // set current page
    this.currentPage = event;
    // show loading component
    this.loading = true;
    // load new data
    this.loadProductFeedbacksPerPage();
  }

  /**
   * init data
   */
  private initData() {
    // init current product's quantity
    this.selectedProductQuantity = 1;
    // init current page
    this.currentPage = 1;
    // init number of product's feedbacks per page
    this.nProductFeedbacksPerPage = 8;
  }

  /**
   * load product's feedbacks per page
   */
  private loadProductFeedbacksPerPage() {
    // init startIndex
    this.startIndex = ((this.currentPage - 1) * 8) + 1;
    // get product's feedbacks data per page
    this.productFeedbacksPerPage = this.productFeedbacksTemp.slice(this.startIndex - 1, this.startIndex + 7);
    // hide loading component
    this.loading = false;
    // load number of reactions, replies for product's feedbacks per page
    this.loadNumberOfRepliesAndReactions();
    // check which feedback that current user liked and disliked
    this.loadProductFeedbackUserLikedAndDisliked();
  }

  /**
   * add product's feedback for selected product
   */
  public addProductReview() {
    // add product's feedback
    this.addProductFeedback();
    // add product's rate
    this.addProductRate();
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
   * get selected user's profile
   */
  private getSelectedUserProfile() {
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
        }
      });
  }

  /**
   * get selected's product rate
   */
  private getSelectedProductRate() {
    // show loading component
    this.loading = true;
    // get selected product's rate
    this.productRateService.getProductRateByUserIdAndProductId(
      this.selectedUserProfile.id,
      this.selectedProduct.id
    )
      .subscribe((selectedProductRate: ProductRate) => {
        if (selectedProductRate) {
          this.selectedProductRate = selectedProductRate;
          this.selectedProductRateValue = this.selectedProductRate.rate;
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   *
   * @param event - rate value
   */
  public onRateChanged(event) {
    this.selectedProductRateValue = event;
  }

  /**
   * add product's feedback
   */
  private addProductFeedback() {
    // check review's content is empty or not
    if (this.reviewContent.localeCompare('') === 0) {
      // show warning message to user
      this.createNotification('error', 'Error', 'Please input your review\'s content');
    } else {
      // create new product's feedback
      const productFeedback = new ProductFeedback();
      productFeedback.feedbackContent = this.reviewContent;
      productFeedback.feedbackCreatedDate = new Date();
      productFeedback.feedbackStatus = 1;
      productFeedback.product = this.selectedProduct;
      productFeedback.userProfile = this.selectedUserProfile;
      productFeedback.nLikes = 0;
      productFeedback.nDislikes = 0;
      productFeedback.nReplies = 0;

      // add product's feedback client
      this.addNewProductFeedbackOnClient(productFeedback);
      // add product's feedback to database
      this.addNewProductFeedbackToServer(productFeedback);
    }
  }

  /**
   *
   * @param productFeedback - selected product's feedback
   *
   */
  private addNewProductFeedbackOnClient(productFeedback: ProductFeedback) {
    // add product's feedbacks
    this.productFeedbacks.push(productFeedback);
    // assign all data to product's feedbacks temp
    this.productFeedbacksTemp = this.productFeedbacks;
    // get total number of product's feedbacks
    this.totalProductFeedbacks = this.productFeedbacksTemp.length;
    // add to current page if have any free space left
    if (this.productFeedbacksPerPage.length < 8) {
      this.productFeedbacksPerPage.push(productFeedback);
    }
  }

  /**
   * add new product's feedback to server
   */
  private addNewProductFeedbackToServer(productFeedback) {
    this.productFeedbackService.addProductFeedback(productFeedback)
      .subscribe((insertedProductFeedback: ProductFeedback) => {
        if (insertedProductFeedback) {
          // assign new product's feedback
          this.reviewContent = '';
          // show success notification
          this.createNotification('success', 'Success', 'Thank your for your feedback!!!');
        } else {
          // show error notification
          this.createNotification('error', 'Error', 'Cannot submit your feedback! Please try again!');
        }
      });
  }

  /**
   * add product's rate
   */
  private addProductRate() {
    // create new product's rate object
    const productRate = new ProductRate();
    productRate.rate = this.selectedProductRateValue;
    productRate.product = this.selectedProduct;
    productRate.userProfile = this.selectedUserProfile;

    // add to database
    this.productRateService.addProductRate(productRate)
      .subscribe((insertedProductRate: ProductRate) => {
        if (insertedProductRate) {
          console.log(insertedProductRate);
          // assign new product's rate
          this.selectedProductRate = insertedProductRate;
          this.selectedProductRateValue = insertedProductRate.rate;
        }
      });
  }

  /**
   * load number of replies and reactions
   */
  private loadNumberOfRepliesAndReactions() {
    this.productFeedbacksPerPage.map(eachProductFeedback => {
      // count number of product feedback replies
      this.replyOnProductFeedbackService.countNumberOfProductFeedbackReplies(eachProductFeedback, 1)
        .subscribe((nReplies: ResponseMessage) => {
          if (nReplies) {
            eachProductFeedback.nReplies = Number(nReplies.message);
          } else {
            eachProductFeedback.nReplies = 0;
          }
        });
      // count number of like
      this.productFeedbackReactionService.countNumberOfProductFeedbackReactions(eachProductFeedback, 1)
        .subscribe((nLikes: ResponseMessage) => {
          if (nLikes) {
            eachProductFeedback.nLikes = Number(nLikes.message);
          } else {
            eachProductFeedback.nLikes = 0;
          }
        });
      // count number of dislikes
      this.productFeedbackReactionService.countNumberOfProductFeedbackReactions(eachProductFeedback, 0)
        .subscribe((nDisLikes: ResponseMessage) => {
          if (nDisLikes) {
            eachProductFeedback.nDislikes = Number(nDisLikes.message);
          } else {
            eachProductFeedback.nDislikes = 0;
          }
        });
    });
  }

  /**
   * load product's feedback that user liked and disliked
   */
  private loadProductFeedbackUserLikedAndDisliked() {
    this.productFeedbackReactionService.getProductFeedbackReactionsByUserProfile(this.selectedUserProfile)
      .subscribe((productFeedbackReactions: ProductFeedbackReaction[]) => {
        if (productFeedbackReactions) {
          // show current like and dislike status of current user's profile
          for (const eachProductFeedbackReaction of productFeedbackReactions) {
            for (const eachProductFeedback of this.productFeedbacksPerPage) {
              eachProductFeedback.isReacted = true;
              if (eachProductFeedbackReaction.productFeedback.id === eachProductFeedback.id) {
                if (eachProductFeedbackReaction.reaction === 1) {
                  // show like status
                  eachProductFeedback.isLikeClicked = true;
                } else if (eachProductFeedbackReaction.reaction === 0) {
                  // show dislike status
                  eachProductFeedback.isLikeClicked = false;
                }
                break;
              }
            }
          }
        }
      });
  }

  /**
   *
   * @param selectedComment - selected comment that user wants to like
   */
  public like(selectedComment: ProductFeedback) {
    if (selectedComment.isLikeClicked === true) {
      return;
    }
    if (selectedComment.nDislikes > 0 && selectedComment.isReacted) {
      selectedComment.nDislikes -= 1;
    }
    selectedComment.nLikes += 1;
    selectedComment.isLikeClicked = true;
    selectedComment.isReacted = true;
    // submit new product's feedback reaction to database
    this.submitNewProductFeedbackReaction(selectedComment, 1);
  }

  /**
   *
   * @param selectedComment - selected comment that user wants to dislike
   */
  public dislike(selectedComment: ProductFeedback) {
    if (selectedComment.isLikeClicked === false) {
      return;
    }
    if (selectedComment.nLikes > 0 && selectedComment.isReacted) {
      selectedComment.nLikes -= 1;
    }
    selectedComment.nDislikes += 1;
    selectedComment.isLikeClicked = false;
    selectedComment.isReacted = true;
    // submit new product's feedback reaction to database
    this.submitNewProductFeedbackReaction(selectedComment, 0);
  }

  /**
   *
   * @param selectedComment - selected product's feedback
   * @param reactionValue - reaction's value
   */
  private submitNewProductFeedbackReaction(selectedComment, reactionValue) {
    // create new product's feedback reaction object
    const newProductFeedbackReaction = new ProductFeedbackReaction();
    newProductFeedbackReaction.productFeedback = selectedComment;
    newProductFeedbackReaction.userProfile = this.selectedUserProfile;
    newProductFeedbackReaction.reaction = reactionValue;
    // submit to the database
    this.productFeedbackReactionService.addNewProductFeedbackReaction(newProductFeedbackReaction)
      .subscribe((insertedProductFeedbackReaction: ProductFeedbackReaction) => {
        if (insertedProductFeedbackReaction) {
          console.log(insertedProductFeedbackReaction);
        }
      });
  }

  /**
   *
   * @param selectedComment - selected product's feedback that user want to view replies
   */
  public viewRepliesOfSelectedProductFeedback(selectedComment) {
    if (!selectedComment.replies) {
      this.replyOnProductFeedbackService.getRepliesOnSelectedProductFeedback(selectedComment, 1)
        .subscribe((repliesOnProductFeedback: ReplyOnProductFeedback[]) => {
          if (repliesOnProductFeedback) {
            selectedComment.replies = repliesOnProductFeedback;
            // load number of likes and dislikes of replies on product's feedback
            this.loadNumberOfReplyOnProductFeedbackReactions(selectedComment);
            // check which reply on product's feedback that current user liked and disliked
            this.loadReplyOnProductFeedbackUserLikedAndDisliked(selectedComment);
          }
        });
    }
  }

  /**
   *
   * @param selectedComment - selected comment that user want to load number of reply's reactions
   */
  private loadNumberOfReplyOnProductFeedbackReactions(selectedComment: any) {
    for (const eachReplyOnProductFeedback of selectedComment.replies) {
      // count number of likes
      this.replyOnProductFeedbackReactionService.countNumberOfReplyOnProductFeedbackReaction(eachReplyOnProductFeedback, 1)
        .subscribe((nLikes: ResponseMessage) => {
          if (nLikes) {
            eachReplyOnProductFeedback.nLikes = Number(nLikes.message);
          } else {
            eachReplyOnProductFeedback.nLikes = 0;
          }
        });
      // count number dislikes
      this.replyOnProductFeedbackReactionService.countNumberOfReplyOnProductFeedbackReaction(eachReplyOnProductFeedback, 0)
        .subscribe((nDislikes: ResponseMessage) => {
          if (nDislikes) {
            eachReplyOnProductFeedback.nDislikes = Number(nDislikes.message);
          } else {
            eachReplyOnProductFeedback.nDislikes = 0;
          }
        });
    }
  }

  /**
   * check which reply on product's feedback that current user liked and disliked
   */
  private loadReplyOnProductFeedbackUserLikedAndDisliked(selectedComment) {
    this.replyOnProductFeedbackReactionService.getReplyOnProductFeedbackReactionsByUserProfile(this.selectedUserProfile)
      .subscribe((replyOnProductFeedbackReactions: ReplyOnProductFeedbackReaction[]) => {
        if (replyOnProductFeedbackReactions) {
          // show current like and dislike status of current user's profile
          for (const eachReplyOnProductFeedbackReaction of replyOnProductFeedbackReactions) {
            for (const eachReplyOnProductFeedback of selectedComment.replies) {
              eachReplyOnProductFeedback.isReacted = true;
              if (eachReplyOnProductFeedbackReaction.replyOnProductFeedback.id === eachReplyOnProductFeedback.id) {
                if (eachReplyOnProductFeedbackReaction.reaction === 1) {
                  eachReplyOnProductFeedback.isLikeClicked = true;
                } else if (eachReplyOnProductFeedbackReaction.reaction === 0) {
                  eachReplyOnProductFeedback.isLikeClicked = false;
                }
                break;
              }
            }
          }
        }
      });
  }

  /**
   *
   * @param selectedReplyOnProductFeedback - selectedReplyOnProductFeedback
   */
  public likeReplyOnProductFeedback(selectedReplyOnProductFeedback: ReplyOnProductFeedback) {
    if (selectedReplyOnProductFeedback.isLikeClicked === true) {
      return;
    }
    if (selectedReplyOnProductFeedback.nDislikes > 0 && selectedReplyOnProductFeedback.isReacted) {
      selectedReplyOnProductFeedback.nDislikes -= 1;
    }
    selectedReplyOnProductFeedback.nLikes += 1;
    selectedReplyOnProductFeedback.isLikeClicked = true;
    selectedReplyOnProductFeedback.isReacted = true;
    // submit new reply on product feedback reaction to database
    this.submitNewReplyProductFeedbackReaction(selectedReplyOnProductFeedback, 1);
  }

  /**
   *
   * @param selectedReplyOnProductFeedback - selectedReplyOnProductFeedback
   */
  public dislikeReplyOnProductFeedback(selectedReplyOnProductFeedback: ReplyOnProductFeedback) {
    if (selectedReplyOnProductFeedback.isLikeClicked === false) {
      return;
    }
    if (selectedReplyOnProductFeedback.nLikes > 0 && selectedReplyOnProductFeedback.isReacted) {
      selectedReplyOnProductFeedback.nLikes -= 1;
    }
    selectedReplyOnProductFeedback.nDislikes += 1;
    selectedReplyOnProductFeedback.isLikeClicked = false;
    selectedReplyOnProductFeedback.isReacted = true;
    // submit new reply on product feedback reaction to database
    this.submitNewReplyProductFeedbackReaction(selectedReplyOnProductFeedback, 0);
  }

  /**
   *
   * @param selectedReplyOnProductFeedback - selected reply on product feedback
   * @param reactionValue - reaction's value
   */
  private submitNewReplyProductFeedbackReaction(selectedReplyOnProductFeedback, reactionValue) {
    // create new reply on product feedback reaction object
    const newReplyOnProductFeedbackReaction = new ReplyOnProductFeedbackReaction();
    newReplyOnProductFeedbackReaction.replyOnProductFeedback = selectedReplyOnProductFeedback;
    newReplyOnProductFeedbackReaction.userProfile = this.selectedUserProfile;
    newReplyOnProductFeedbackReaction.reaction = reactionValue;
    // submit to the database
    this.replyOnProductFeedbackReactionService.addNewReplyOnProductFeedbackReaction(newReplyOnProductFeedbackReaction)
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
  public showReplyProductFeedbackBox(selectedComment) {
    selectedComment.isReplyBoxShown = true;
  }

  public showReplyReplyProductFeedbackBox(selectedReplyComment) {
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
   * @param replyContent - reply's content
   * @param selectedComment - selectedComment
   */
  public replyToProductFeedback(selectedComment, replyContent) {
    // create new reply on product' feedback
    const newReplyOnProductFeedback = new ReplyOnProductFeedback();
    newReplyOnProductFeedback.replyOnProductFeedbackContent = replyContent;
    newReplyOnProductFeedback.replyOnProductFeedbackStatus = 1;
    newReplyOnProductFeedback.replyOnProductFeedbackCreateDate = new Date();
    newReplyOnProductFeedback.productFeedback = selectedComment;
    newReplyOnProductFeedback.userProfile = this.selectedUserProfile;
    newReplyOnProductFeedback.nLikes = 0;
    newReplyOnProductFeedback.nDislikes = 0;

    // add new reply on product feedback to the server
    this.replyOnProductFeedbackService.addReplyOnProductFeedback(newReplyOnProductFeedback)
      .subscribe((insertedReplyOnProductFeedback: ReplyOnProductFeedback) => {
        if (insertedReplyOnProductFeedback) {
          console.log(insertedReplyOnProductFeedback);
        }
      });

    // add new reply on client
    if (selectedComment.replies && selectedComment.replies.length) {
      selectedComment.replies.push(newReplyOnProductFeedback);
    }
    selectedComment.nReplies += 1;
  }

  /**
   * add product to cart
   */
  public addProductToCart() {
    // check number of quantity that user want to buy is greater number of quantity in the database or not
    if (this.selectedProductQuantity > this.selectedProduct.productQuantity) {
      this.createNotification('error', 'Error', 'Sorry! Your product\'s quantity is exceed number of products in the storage');
      return;
    }
    if (localStorage.getItem(Config.shoppingCart)) {
      // get current shopping cart list if it existed
      const currentShoppingCart = JSON.parse(localStorage.getItem(Config.shoppingCart));
      // add product to shopping cart
      this.addProductToShoppingCart(currentShoppingCart);
    } else {
      // init shopping cart if it is not existed
      this.initShoppingCart();
    }
  }

  /**
   *
   * @param currentShoppingCart - current shopping cart
   */
  private addProductToShoppingCart(currentShoppingCart) {
    let isProductExistedInCurrentShoppingCart = false;
    for (const eachProductShoppingCart of currentShoppingCart) {
      if (eachProductShoppingCart.product.id === this.selectedProduct.id) {
        // if product existed in the current shopping cart, just increase quantity
        eachProductShoppingCart.quantity += this.selectedProductQuantity;
        isProductExistedInCurrentShoppingCart = true;
        break;
      }
    }
    if (!isProductExistedInCurrentShoppingCart) {
      // create new shopping cart object
      const productShoppingCart = new ShoppingCart();
      productShoppingCart.product = this.selectedProduct;
      productShoppingCart.quantity = this.selectedProductQuantity;
      // add product to current shopping cart
      currentShoppingCart.push(productShoppingCart);
    }
    // save local storage
    localStorage.setItem(Config.shoppingCart, JSON.stringify(currentShoppingCart));
    // show message to user
    this.createNotification('success', 'Success', `${this.selectedProduct.productName} was added to cart successfully`);
  }

  /**
   * init shopping cart
   */
  private initShoppingCart() {
    // if current shopping cart does not existed, create new one
    const currentShoppingCart = [];
    // create shoppingCart object
    const newProductShoppingCart = new ShoppingCart();
    newProductShoppingCart.quantity = 1;
    newProductShoppingCart.product = this.selectedProduct;
    // add current product to currentShoppingCart
    currentShoppingCart.push(newProductShoppingCart);
    // save to localStorage
    localStorage.setItem(Config.shoppingCart, JSON.stringify(currentShoppingCart));
    // show message to user
    this.createNotification('success', 'Success', `${this.selectedProduct.productName} was added to cart successfully`);
  }
}
