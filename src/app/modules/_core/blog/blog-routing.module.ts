import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '@gw-modules/core/blog/home/home.component';
import { MainComponent } from '@gw-modules/core/blog/main/main.component';
import { BlogCategoryComponent } from '@gw-modules/core/blog/blog-category/blog-category.component';
import { BlogSearchComponent } from '@gw-modules/core/blog/blog-search/blog-search.component';
import { BlogDetailComponent } from '@gw-modules/core/blog/blog-detail/blog-detail.component';
import { BlogTagComponent } from '@gw-modules/core/blog/blog-tag/blog-tag.component';
import { AboutComponent } from '@gw-share-module/core/about/about.component';
import { PrivacyPolicyComponent } from '@gw-share-module/core/privacy-policy/privacy-policy.component';
import { ContactComponent } from '@gw-share-module/core/contact/contact.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'home' },
      { path: 'home', component: MainComponent },
      { path: 'category/:slug', component: BlogCategoryComponent },
      { path: 'search', component: BlogSearchComponent },
      { path: 'post/:slug', component: BlogDetailComponent },
      { path: 'tag/:slug', component: BlogTagComponent },
      { path: 'about', component: AboutComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'contact', component: ContactComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule {
}
