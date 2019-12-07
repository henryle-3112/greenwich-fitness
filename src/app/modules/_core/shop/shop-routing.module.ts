import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  HomeComponent,
  MainComponent,
  ProductCategoryComponent,
  ProductDetailComponent,
  ProductSearchComponent,
  ShoppingCartComponent
} from '@gw-shop-module/components';
import {AboutComponent, ContactComponent, PrivacyPolicyComponent} from '@gw-share-module/components';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {path: '', redirectTo: 'home'},
      {path: 'home', component: MainComponent},
      {path: 'category/:slug', component: ProductCategoryComponent},
      {path: 'search', component: ProductSearchComponent},
      {path: 'product/:slug', component: ProductDetailComponent},
      {path: 'about', component: AboutComponent},
      {path: 'privacy-policy', component: PrivacyPolicyComponent},
      {path: 'contact', component: ContactComponent},
      {path: 'cart', component: ShoppingCartComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule {
}
