import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgZorroAntdModule } from 'ng-zorro-antd';

import { BlogRoutingModule } from './blog-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ShareModule } from '@gw-share-module/core/share.module';

import { HomeComponent } from '@gw-modules/core/blog/home/home.component';
import { MainComponent } from '@gw-modules/core/blog/main/main.component';
import { BlogCategoryComponent } from '@gw-modules/core/blog/blog-category/blog-category.component';
import { BlogSearchComponent } from '@gw-modules/core/blog/blog-search/blog-search.component';
import { BlogDetailComponent } from '@gw-modules/core/blog/blog-detail/blog-detail.component';
import { BlogTagComponent } from '@gw-modules/core/blog/blog-tag/blog-tag.component';


@NgModule({
  declarations: [
    HomeComponent,
    MainComponent,
    BlogCategoryComponent,
    BlogSearchComponent,
    BlogDetailComponent,
    BlogTagComponent
  ],
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
