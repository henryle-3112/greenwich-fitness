import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgZorroAntdModule } from 'ng-zorro-antd';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareModule } from '../../../../share/share.module';
import { HomeComponent } from './home/home.component';
import { ShopRoutingModule } from './shop-routing.module';
import { MainComponent } from './main/main.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductSearchComponent } from './product-search/product-search.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

@NgModule({
  declarations: [
    HomeComponent,
    MainComponent,
    ProductCategoryComponent,
    ProductSearchComponent,
    ProductDetailComponent,
    ShoppingCartComponent
  ],
  imports: [
    CommonModule,
    ShareModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    ShopRoutingModule
  ]
})
export class ShopModule {
}
