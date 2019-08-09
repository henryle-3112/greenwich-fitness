import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgZorroAntdModule} from 'ng-zorro-antd';

import {BlogRoutingModule} from './blog-routing.module';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ShareModule} from '../../../../share/share.module';
import {HomeComponent} from './home/home.component';
import { MainComponent } from './main/main.component';
import { BlogCategoryComponent } from './blog-category/blog-category.component';
import { BlogSearchComponent } from './blog-search/blog-search.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogTagComponent } from './blog-tag/blog-tag.component';

@NgModule({
  declarations: [HomeComponent, MainComponent, BlogCategoryComponent, BlogSearchComponent, BlogDetailComponent, BlogTagComponent],
  imports: [
    CommonModule,
    ShareModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    BlogRoutingModule
  ]
})
export class BlogModule {
}
