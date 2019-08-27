import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { ProductCategoryComponent } from './product-category/product-category.component';
import { ProductSearchComponent } from './product-search/product-search.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { AboutComponent } from '../../../../share/about/about.component';
import { PrivacyPolicyComponent } from '../../../../share/privacy-policy/privacy-policy.component';
import { ContactComponent } from '../../../../share/contact/contact.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

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
