import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ProductCategory} from '@gw-models';

@Injectable({
  providedIn: 'root'
})
export class ShareProductCategoryService {
  public currentProductCategory: Observable<ProductCategory>;
  public currentProductCategories: Observable<ProductCategory[]>;
  private currentProductCategorySubject: BehaviorSubject<ProductCategory>;
  private currentProductCategoriesSubject: BehaviorSubject<ProductCategory[]>;

  constructor() {
    this.currentProductCategorySubject = new BehaviorSubject<ProductCategory>(null);
    this.currentProductCategory = this.currentProductCategorySubject.asObservable();

    this.currentProductCategoriesSubject = new BehaviorSubject<ProductCategory[]>(null);
    this.currentProductCategories = this.currentProductCategoriesSubject.asObservable();
  }

  public changeProductCategory(productCategory: ProductCategory) {
    this.currentProductCategorySubject.next(productCategory);
  }

  public changeProductCategories(productCategories: ProductCategory[]) {
    this.currentProductCategoriesSubject.next(productCategories);
  }
}
