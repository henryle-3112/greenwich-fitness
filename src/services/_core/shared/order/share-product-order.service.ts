import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductOrder } from '@gw-models/core';

@Injectable({
  providedIn: 'root'
})
export class ShareProductOrderService {

  private currentProductOrderSubject: BehaviorSubject<ProductOrder>;
  public currentProductOrder: Observable<ProductOrder>;

  constructor() {
    this.currentProductOrderSubject = new BehaviorSubject<ProductOrder>(null);
    this.currentProductOrder = this.currentProductOrderSubject.asObservable();
  }

  public changeProductOrder(productOrder: ProductOrder) {
    this.currentProductOrderSubject.next(productOrder);
  }
}
