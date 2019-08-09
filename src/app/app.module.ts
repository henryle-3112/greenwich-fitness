import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {NZ_I18N, en_US, NZ_ICONS} from 'ng-zorro-antd';
import {IconDefinition} from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import {NgZorroAntdModule} from 'ng-zorro-antd';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';

import {LoginComponent} from './pages/login/login.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {RegisterComponent} from './pages/register/register.component';
import {NavigatorComponent} from './structure/navigator/navigator.component';
import {PopupComponent} from './structure/popup/popup.component';
import {JwtInterceptor} from '../helpers/jwt.interceptor';
import {ErrorInterceptor} from '../helpers/error.interceptor';
import {ChangePasswordComponent} from './pages/change-password/change-password.component';
import {AlertVerifyEmailComponent} from './pages/alert-verify-email/alert-verify-email.component';
import {ActiveAccountComponent} from './pages/active-account/active-account.component';
import {ShareModule} from '../share/share.module';

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
    {provide: NZ_I18N, useValue: en_US},
    {provide: NZ_ICONS, useValue: icons},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
