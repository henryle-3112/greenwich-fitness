import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgZorroAntdModule } from 'ng-zorro-antd';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ShopRoutingModule } from './shop-routing.module';

import { ShareModule } from '@gw-share-module/core/share.module';

import { HomeComponent } from '@gw-modules/core/shop/home/home.component';
import { MainComponent } from '@gw-modules/core/shop/main/main.component';
import { ProductCategoryComponent } from '@gw-modules/core/shop/product-category/product-category.component';
import { ProductSearchComponent } from '@gw-modules/core/shop/product-search/product-search.component';
import { ProductDetailComponent } from '@gw-modules/core/shop/product-detail/product-detail.component';
import { ShoppingCartComponent } from '@gw-modules/core/shop/shopping-cart/shopping-cart.component';

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
