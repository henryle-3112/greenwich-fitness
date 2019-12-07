import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ProductOrder} from '@gw-models';

@Injectable({
  providedIn: 'root'
})
export class ShareProductOrderService {

  public currentProductOrder: Observable<ProductOrder>;
  private currentProductOrderSubject: BehaviorSubject<ProductOrder>;

  constructor() {
    this.currentProductOrderSubject = new BehaviorSubject<ProductOrder>(null);
    this.currentProductOrder = this.currentProductOrderSubject.asObservable();
  }

  public changeProductOrder(productOrder: ProductOrder) {
    this.currentProductOrderSubject.next(productOrder);
  }
}
