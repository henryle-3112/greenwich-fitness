import { ContactComponent } from './../../../../share/contact/contact.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '@gw-modules/core/shop/home/home.component';
import { MainComponent } from '@gw-modules/core/shop/main/main.component';
import { ProductCategoryComponent } from '@gw-modules/core/shop/product-category/product-category.component';
import { ProductSearchComponent } from '@gw-modules/core/shop/product-search/product-search.component';
import { ProductDetailComponent } from '@gw-modules/core/shop/product-detail/product-detail.component';
import { ShoppingCartComponent } from '@gw-modules/core/shop/shopping-cart/shopping-cart.component';
import { AboutComponent } from '@gw-share-module/core/about/about.component';
import { PrivacyPolicyComponent } from '@gw-share-module/core/privacy-policy/privacy-policy.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'home' },
      { path: 'home', component: MainComponent },
      { path: 'category/:slug', component: ProductCategoryComponent },
      { path: 'search', component: ProductSearchComponent },
      { path: 'product/:slug', component: ProductDetailComponent },
      { path: 'about', component: AboutComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'cart', component: ShoppingCartComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule {
}
