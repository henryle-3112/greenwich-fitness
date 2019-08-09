import {Component, OnInit} from '@angular/core';
import {ShareProductOrderService} from '@gw-services/core/shared/order/share-product-order.service';
import {Router} from '@angular/router';
import {ProductOrder, ProductOrderDetail} from '@gw-models/core';
import {ProductOrderDetailService} from '@gw-services/core/api/product/product-order-detail.service';

@Component({
  selector: 'app-buying-history-detail',
  templateUrl: './buying-history-detail.component.html',
  styleUrls: ['./buying-history-detail.component.css']
})
export class BuyingHistoryDetailComponent implements OnInit {

  // selected product's order
  selectedProductOrder: ProductOrder;

  // check loading component is showing or not
  loading: boolean;

  // list of product order details
  productOrderDetails: ProductOrderDetail[];

  // total price
  totalPrice: number;

  constructor(private shareProductOrderService: ShareProductOrderService,
              private router: Router,
              private productOrderDetailService: ProductOrderDetailService) {
  }

  ngOnInit() {
    // init productOrderDetails
    this.productOrderDetails = [];
    // get selected product order
    this.getSelectedProductOrder();
  }

  /**
   * get selectd product order
   */
  private getSelectedProductOrder() {
    // show loading component
    this.loading = true;
    this.shareProductOrderService.currentProductOrder
      .subscribe((selectedProductOrder: ProductOrder) => {
        if (selectedProductOrder) {
          this.selectedProductOrder = selectedProductOrder;
          // get list of product order details
          this.getProductOrderDetails();
        } else {
          // redirect to client page
          this.router.navigate(['/client']);
        }
        // hide loading component
        this.loading = false;
      });
  }

  /**
   * get product order details
   */
  private getProductOrderDetails() {
    // show loading component
    this.loading = true;
    this.productOrderDetailService.getProductOrderDetailsByProductOrder(this.selectedProductOrder)
      .subscribe((productOrderDetails: ProductOrderDetail[]) => {
        if (productOrderDetails) {
          this.productOrderDetails = productOrderDetails;
          // calculate total price
          this.totalPrice = 0;
          for (const eachProductOrderDetail of productOrderDetails) {
            this.totalPrice = this.totalPrice + eachProductOrderDetail.quantity * eachProductOrderDetail.product.productPrice;
          }
        } else {
          // redirect to client page
          this.router.navigate(['/client']);
        }
        // hide loading component
        this.loading = false;
      });
  }
}
