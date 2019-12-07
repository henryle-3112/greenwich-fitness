import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {en_US, NgZorroAntdModule, NZ_I18N, NZ_ICONS} from 'ng-zorro-antd';
import {IconDefinition} from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {
  ActiveAccountComponent,
  AlertVerifyEmailComponent,
  ChangePasswordComponent,
  LoginComponent,
  NotFoundComponent,
  RegisterComponent
} from '@gw-pages';
import {NavigatorComponent, PopupComponent} from '@gw-structure';

import {ShareModule} from '@gw-share-module';

import {ErrorInterceptor, JwtInterceptor} from '@gw-helpers';

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
