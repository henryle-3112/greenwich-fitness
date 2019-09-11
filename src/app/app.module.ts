import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NZ_I18N, en_US, NZ_ICONS } from 'ng-zorro-antd';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { LoginComponent } from '@gw-pages/core/login/login.component';
import { NotFoundComponent } from '@gw-pages/core/not-found/not-found.component';
import { RegisterComponent } from '@gw-pages/core/register/register.component';
import { ChangePasswordComponent } from '@gw-pages/core/change-password/change-password.component';
import { AlertVerifyEmailComponent } from '@gw-pages/core/alert-verify-email/alert-verify-email.component';
import { ActiveAccountComponent } from '@gw-pages/core/active-account/active-account.component';


import { NavigatorComponent } from '@gw-structure/core/navigator/navigator.component';
import { PopupComponent } from '@gw-structure/core/popup/popup.component';

import { JwtInterceptor, ErrorInterceptor } from '@gw-helpers/core';

import { ShareModule } from '@gw-share-module/core/share.module';

registerLocaleData(en);

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    RegisterComponent,
    NavigatorComponent,
    PopupComponent,
    ChangePasswordComponent,
    AlertVerifyEmailComponent,
    ActiveAccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserAnimationsModule,
    ScrollingModule,
    DragDropModule,
    NgZorroAntdModule,
    ShareModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_ICONS, useValue: icons },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
