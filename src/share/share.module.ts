import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgZorroAntdModule} from 'ng-zorro-antd';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
  AboutComponent,
  ContactComponent,
  FacebookLikeComponent,
  ForgotPasswordComponent,
  LoadingComponent,
  PinterestShareComponent,
  PrivacyPolicyComponent,
  TwitterShareComponent
} from '@gw-share-module/components';

@NgModule({
  declarations: [
    LoadingComponent,
    ForgotPasswordComponent,
    FacebookLikeComponent,
    TwitterShareComponent,
    PinterestShareComponent,
    AboutComponent,
    ContactComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    LoadingComponent,
    ForgotPasswordComponent,
    FacebookLikeComponent,
    TwitterShareComponent,
    PinterestShareComponent,
    AboutComponent,
    ContactComponent,
    PrivacyPolicyComponent
  ]
})
export class ShareModule {
}
