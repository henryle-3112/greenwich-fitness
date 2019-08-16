import {Component, OnInit} from '@angular/core';
import {ProductOrder, UserProfile} from '@gw-models/core';
import {ShareUserProfileService} from '@gw-services/core/shared/user-profile/share-user-profile.service';
import {Router} from '@angular/router';
import {ProductOrderService} from '@gw-services/core/api/product/product-order.service';
import {ShareProductOrderService} from '@gw-services/core/shared/order/share-product-order.service';
import {Config} from '@gw-config/core';

@Component({
  selector: 'app-buying-history',
  templateUrl: './buying-history.component.html',
  styleUrls: ['./buying-history.component.css']
})
export class BuyingHistoryComponent implements OnInit {
  selectedUserProfile: UserProfile;
  productOrders: ProductOrder[];
  currentProductOrdersPage;
  isLoadingSpinnerShown: boolean;
  nProductOrdersPerPage: number;
  totalProductOrders: number;
  selectedProductOrderStatus: string;

  /**
   *
   * @param shareUserProfileService - inject shareUserProfileService
   * @param productOrderService - inject productOrderService
   * @param shareProductOrderService - inject shareProductOrderService
   * @param router - inject router
   */
  constructor(private shareUserProfileService: ShareUserProfileService,
              private productOrderService: ProductOrderService,
              private shareProductOrderService: ShareProductOrderService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.currentProductOrdersPage = Config.currentPage;
    this.nProductOrdersPerPage = Config.numberItemsPerPage;
    this.selectedProductOrderStatus = '0';
    this.getSelectedUserProfile();
  }

  /**
   * get selected user
   */
  private getSelectedUserProfile(): void {
    this.isLoadingSpinnerShown = true;
    this.shareUserProfileService.currentUserProfile
      .subscribe(selectedUserProfile => {
        if (selectedUserProfile) {
          this.selectedUserProfile = selectedUserProfile;
          this.getProductOrders();
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get product orders by page
   */
  private getProductOrders(): void {
    this.isLoadingSpinnerShown = true;
    const selectedProductOrderStatus = Number(this.selectedProductOrderStatus);
    const selectedUserProfileId = this.selectedUserProfile.id;
    const getProductOrdersUrl = `${Config.apiBaseUrl}/
${Config.apiProductManagementPrefix}/
${Config.apiProductOrders}?
${Config.userProfileIdParameter}=${selectedUserProfileId}&
${Config.pageParameter}=${this.currentProductOrdersPage}&
${Config.statusParameter}=${selectedProductOrderStatus}`;
    this.productOrderService.getProductOrders(getProductOrdersUrl)
      .subscribe(response => {
        this.productOrders = response.body;
        this.totalProductOrders = Number(response.headers.get(Config.headerXTotalCount));
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   *
   * @param event - current page
   */
  public productOrdersPageChange(event): void {
    this.currentProductOrdersPage = event;
    this.getProductOrders();
  }

  /**
   *
   * @param event - current value
   */
  public onProductOrderStatusChanged(event): void {
    this.getProductOrders();
  }

  /**
   * go to buying history detail
   */
  public goToBuyingHistoryDetail(selectedProductOrder: ProductOrder): void {
    // pass selected product order to buying history detail component
    this.shareProductOrderService.changeProductOrder(selectedProductOrder);
    this.router.navigate(['/client/buying/history/detail']);
  }

}
