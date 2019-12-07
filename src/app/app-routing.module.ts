import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '@gw-services/guard';
import {
  ActiveAccountComponent,
  AlertVerifyEmailComponent,
  ChangePasswordComponent,
  LoginComponent,
  NotFoundComponent,
  RegisterComponent
} from '@gw-pages';
import {Role} from '@gw-models';
import {ForgotPasswordComponent} from '@gw-share-module/components';


const routes: Routes = [
  {
    path: 'client',
    loadChildren: '@gw-client-module/client.module#ClientModule',
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Admin, Role.Coach, Role.User]
    }
  },
  {
    path: 'shop',
    loadChildren: '@gw-shop-module/shop.module#ShopModule',
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Admin, Role.Coach, Role.User]
    }
  },
  {
    path: 'blog',
    loadChildren: '@gw-blog-module/blog.module#BlogModule',
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Admin, Role.Coach, Role.User]
    }
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'email-verify',
    component: AlertVerifyEmailComponent
  },
  {
    path: 'active',
    component: ActiveAccountComponent
  },
  {
    path: '',
    redirectTo: 'client',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
