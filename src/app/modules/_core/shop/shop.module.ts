import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgZorroAntdModule} from 'ng-zorro-antd';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ShopRoutingModule} from './shop-routing.module';
import {
  HomeComponent,
  MainComponent,
  ProductCategoryComponent,
  ProductDetailComponent,
  ProductSearchComponent,
  ShoppingCartComponent
} from '@gw-shop-module/components';
import {ShareModule} from '@gw-share-module';

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
