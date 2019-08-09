import {Component, OnInit} from '@angular/core';
import {ProductOrder, ResponseMessage, UserProfile} from '@gw-models/core';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {Router} from '@angular/router';
import {ProductOrderService} from '@gw-services/core/api/product/product-order.service';
import {ShareProductOrderService} from '@gw-services/core/shared/order/share-product-order.service';

@Component({
  selector: 'app-buying-history',
  templateUrl: './buying-history.component.html',
  styleUrls: ['./buying-history.component.css']
})
export class BuyingHistoryComponent implements OnInit {

  // selected user profile
  selectedUserProfile: UserProfile;

  // list of product orders by user profile and product order status
  productOrders: ProductOrder[];

  // currentPage
  currentPage = 1;
  // loading component is show ot not
  loading: boolean;

  // number of product's orders per page
  nProductOrdersPerPage: number;

  // total product orders
  totalProductOrders: number;

  // selected product's order status
  selectedProductOrderStatus: string;

  // is hide pagination
  isHidePagination: boolean;

  constructor(private shareUserProfileService: ShareUserProfileService,
              private productOrderService: ProductOrderService,
              private shareProductOrderService: ShareProductOrderService,
              private router: Router) {
  }

  ngOnInit() {
    // init is hide pagination
    this.isHidePagination = true;
    // init number of product orders per page
    this.nProductOrdersPerPage = 8;
    // init selected product's order's status
    this.selectedProductOrderStatus = '0';
    // get selected user's profile
    this.getSelectedUserProfile();
  }

  /**
   * get selected user
   */
  private getSelectedUserProfile() {
    // show loading component
    this.loading = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          // get number of product orders
          this.getNumberOfProductOrders();
          // get product orders by page
          this.getProductOrdersByPage();
        } else {
          // redirect to client page
          this.router.navigate(['/client']);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get number of product orders
   */
  private getNumberOfProductOrders() {
    // show loading component
    this.loading = true;
    console.log(this.selectedProductOrderStatus);
    const selectedProductOrderStatus = Number(this.selectedProductOrderStatus);
    this.productOrderService.getNumberOfProductOrdersByUserProfileIdAndProductOrderStatus(
      this.selectedUserProfile.id,
      selectedProductOrderStatus
    ).subscribe((nProductOrders: ResponseMessage) => {
      if (nProductOrders) {
        this.totalProductOrders = Number(nProductOrders.message);
      } else {
        // redirect to client page
        this.router.navigate(['/client']);
      }
      // hide loading component
      this.loading = false;
    });
  }

  /**
   * get product orders by page
   */
  private getProductOrdersByPage() {
    // show loading component
    this.loading = true;
    const selectedProductOrderStatus = Number(this.selectedProductOrderStatus);
    console.log(selectedProductOrderStatus);
    console.log(typeof selectedProductOrderStatus);
    this.productOrderService.getProductOrdersByUserProfileIdAndProductOrderStatusAndByPage(
      this.selectedUserProfile.id,
      selectedProductOrderStatus,
      this.currentPage
    ).subscribe((productOrders: ProductOrder[]) => {
      if (productOrders) {
        this.productOrders = productOrders;
        if (productOrders.length > 0) {
          this.isHidePagination = false;
        }
      } else {
        // redirect to client page
        this.router.navigate(['/client']);
      }
      // hide loading component
      this.loading = false;
    });
  }

  /**
   *
   * @param event - current page
   */
  public productOrdersPageChange(event) {
    // get current page
    this.currentPage = event;
    // get product orders by page
    this.getProductOrdersByPage();
  }

  /**
   *
   * @param event - current value
   */
  public onProductOrderStatusChanged(event) {
    const selectedProductOrderStatus = Number(this.selectedProductOrderStatus);
    // get number of product orders
    this.getNumberOfProductOrders();
    // get product orders by page
    this.getProductOrdersByPage();
  }

  /**
   * go to buying history detail
   */
  public goToBuyingHistoryDetail(selectedProductOrder: ProductOrder) {
    // pass selected productt order to buying history detail component
    this.shareProductOrderService.changeProductOrder(selectedProductOrder);
    // go to buying history detail
    this.router.navigate(['/client/buying/history/detail']);
  }

}
