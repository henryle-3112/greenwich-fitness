import {Component, OnInit} from '@angular/core';
import {ShareProductOrderService} from '@gw-services/core/shared/order/share-product-order.service';
import {Router} from '@angular/router';
import {ProductOrder, ProductOrderDetail} from '@gw-models/core';
import {ProductOrderDetailService} from '@gw-services/core/api/product/product-order-detail.service';
import {Config} from '@gw-config/core';

@Component({
  selector: 'app-buying-history-detail',
  templateUrl: './buying-history-detail.component.html',
  styleUrls: ['./buying-history-detail.component.css']
})
export class BuyingHistoryDetailComponent implements OnInit {
  selectedProductOrder: ProductOrder;
  isLoadingSpinnerShown: boolean;
  productOrderDetails: ProductOrderDetail[];
  totalShoppingCartPrice: number;

  /**
   *
   * @param shareProductOrderService - inject shareProductOrderService
   * @param router - inject router
   * @param productOrderDetailService - inject productOrderDetailService
   */
  constructor(private shareProductOrderService: ShareProductOrderService,
              private router: Router,
              private productOrderDetailService: ProductOrderDetailService) {
  }

  ngOnInit(): void {
    this.productOrderDetails = [];
    this.getSelectedProductOrder();
  }

  /**
   * get selectd product order
   */
  private getSelectedProductOrder(): void {
    this.isLoadingSpinnerShown = true;
    this.shareProductOrderService.currentProductOrder
      .subscribe((selectedProductOrder: ProductOrder) => {
        if (selectedProductOrder) {
          this.selectedProductOrder = selectedProductOrder;
          this.getProductOrderDetails();
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * get product order details
   */
  private getProductOrderDetails(): void {
    this.isLoadingSpinnerShown = true;
    const selectedProductOrderId = this.selectedProductOrder.id;
    const getProductOrderDetailsUrl = `${Config.apiBaseUrl}/
${Config.apiProductManagementPrefix}/
${Config.apiProductOrders}/
${selectedProductOrderId}/
${Config.apiProductOrderDetails}`;
    this.productOrderDetailService.getProductOrderDetails(getProductOrderDetailsUrl)
      .subscribe((productOrderDetails: ProductOrderDetail[]) => {
        if (productOrderDetails) {
          this.productOrderDetails = productOrderDetails;
          this.calculateTotalShoppingCartPrice();
        } else {
          this.router.navigate(['/client']);
        }
        this.isLoadingSpinnerShown = false;
      });
  }

  /**
   * calculate total shopping cart price
   */
  private calculateTotalShoppingCartPrice(): void {
    this.totalShoppingCartPrice = 0;
    for (const eachProductOrderDetail of this.productOrderDetails) {
      this.totalShoppingCartPrice += eachProductOrderDetail.quantity * eachProductOrderDetail.product.productPrice;
    }
  }
}
