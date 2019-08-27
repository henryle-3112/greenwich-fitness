import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from '../../../../share/contact/contact.component';
import { AboutComponent } from '../../../../share/about/about.component';
import { PrivacyPolicyComponent } from '../../../../share/privacy-policy/privacy-policy.component';
import { BlogSearchComponent } from './blog-search/blog-search.component';
import { BlogCategoryComponent } from './blog-category/blog-category.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { MainComponent } from './main/main.component';
import { BlogTagComponent } from './blog-tag/blog-tag.component';


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
