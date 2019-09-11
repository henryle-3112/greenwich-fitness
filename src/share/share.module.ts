import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgZorroAntdModule } from 'ng-zorro-antd';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoadingComponent } from '@gw-share-module/core/loading/loading.component';
import { ForgotPasswordComponent } from '@gw-share-module/core/forgot-password/forgot-password.component';
import { FacebookLikeComponent } from '@gw-share-module/core/facebook-like/facebook-like.component';
import { TwitterShareComponent } from '@gw-share-module/core/twitter-share/twitter-share.component';
import { PinterestShareComponent } from '@gw-share-module/core/pinterest-share/pinterest-share.component';
import { AboutComponent } from '@gw-share-module/core/about/about.component';
import { ContactComponent } from '@gw-share-module/core/contact/contact.component';
import { PrivacyPolicyComponent } from '@gw-share-module/core/privacy-policy/privacy-policy.component';

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
