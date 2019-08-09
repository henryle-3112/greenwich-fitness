import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Product} from '@gw-models/core';

@Injectable({
  providedIn: 'root'
})
export class ShareProductService {
  private currentProductSubject: BehaviorSubject<Product>;
  public currentProduct: Observable<Product>;

  constructor() {
    this.currentProductSubject = new BehaviorSubject<Product>(null);
    this.currentProduct = this.currentProductSubject.asObservable();
  }

  public changeProduct(product: Product) {
    this.currentProductSubject.next(product);
  }
}
