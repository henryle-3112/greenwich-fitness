import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  BlogCategoryComponent,
  BlogDetailComponent,
  BlogSearchComponent,
  BlogTagComponent,
  HomeComponent,
  MainComponent
} from '@gw-blog-module/components';
import {AboutComponent, ContactComponent, PrivacyPolicyComponent} from '@gw-share-module/components';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {path: '', redirectTo: 'home'},
      {path: 'home', component: MainComponent},
      {path: 'category/:slug', component: BlogCategoryComponent},
      {path: 'search', component: BlogSearchComponent},
      {path: 'post/:slug', component: BlogDetailComponent},
      {path: 'tag/:slug', component: BlogTagComponent},
      {path: 'about', component: AboutComponent},
      {path: 'privacy-policy', component: PrivacyPolicyComponent},
      {path: 'contact', component: ContactComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule {
}
