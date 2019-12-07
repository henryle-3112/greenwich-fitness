import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Product} from '@gw-models';

@Injectable({
  providedIn: 'root'
})
export class ShareProductService {
  public currentProduct: Observable<Product>;
  private currentProductSubject: BehaviorSubject<Product>;

  constructor() {
    this.currentProductSubject = new BehaviorSubject<Product>(null);
    this.currentProduct = this.currentProductSubject.asObservable();
  }

  public changeProduct(product: Product) {
    this.currentProductSubject.next(product);
  }
}
