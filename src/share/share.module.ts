import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { NgZorroAntdModule } from 'ng-zorro-antd';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacebookLikeComponent } from './facebook-like/facebook-like.component';
import { TwitterShareComponent } from './twitter-share/twitter-share.component';
import { PinterestShareComponent } from './pinterest-share/pinterest-share.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

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
