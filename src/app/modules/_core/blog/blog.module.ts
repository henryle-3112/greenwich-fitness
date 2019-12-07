import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgZorroAntdModule} from 'ng-zorro-antd';

import {BlogRoutingModule} from './blog-routing.module';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  BlogCategoryComponent,
  BlogDetailComponent,
  BlogSearchComponent,
  BlogTagComponent,
  HomeComponent,
  MainComponent
} from '@gw-blog-module/components';
import {ShareModule} from '@gw-share-module';


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
