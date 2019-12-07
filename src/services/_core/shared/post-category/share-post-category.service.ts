import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {PostCategory} from '@gw-models';

@Injectable({
  providedIn: 'root'
})
export class SharePostCategoryService {
  public currentPostCategory: Observable<PostCategory>;
  public currentPostCategories: Observable<PostCategory[]>;
  private currentPostCategorySubject: BehaviorSubject<PostCategory>;
  private currentPostCategoriesSubject: BehaviorSubject<PostCategory[]>;

  constructor() {
    this.currentPostCategorySubject = new BehaviorSubject<PostCategory>(null);
    this.currentPostCategory = this.currentPostCategorySubject.asObservable();

    this.currentPostCategoriesSubject = new BehaviorSubject<PostCategory[]>(null);
    this.currentPostCategories = this.currentPostCategoriesSubject.asObservable();
  }

  public changePostCategory(postCategory: PostCategory) {
    this.currentPostCategorySubject.next(postCategory);
  }

  public changePostCategories(postCategories: PostCategory[]) {
    this.currentPostCategoriesSubject.next(postCategories);
  }
}
