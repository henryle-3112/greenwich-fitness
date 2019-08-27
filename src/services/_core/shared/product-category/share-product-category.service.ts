import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductCategory } from '@gw-models/core';

@Injectable({
  providedIn: 'root'
})
export class ShareProductCategoryService {
  private currentProductCategorySubject: BehaviorSubject<ProductCategory>;
  public currentProductCategory: Observable<ProductCategory>;

  private currentProductCategoriesSubject: BehaviorSubject<ProductCategory[]>;
  public currentProductCategories: Observable<ProductCategory[]>;

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
