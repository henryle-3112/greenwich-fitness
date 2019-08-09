import {ActiveAccountComponent} from './pages/active-account/active-account.component';
import {AlertVerifyEmailComponent} from './pages/alert-verify-email/alert-verify-email.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {AuthGuard} from '../services/_core/guard/auth.guard';
import {Role} from '@gw-models/core';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {ForgotPasswordComponent} from '../share/forgot-password/forgot-password.component';
import {ChangePasswordComponent} from './pages/change-password/change-password.component';
import {RegisterComponent} from './pages/register/register.component';

const routes: Routes = [
  {
    path: 'client',
    loadChildren: './modules/_core/client/client.module#ClientModule',
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Admin, Role.Coach, Role.User]
    }
  },
  {
    path: 'shop',
    loadChildren: './modules/_core/shop/shop.module#ShopModule',
    canActivate: [AuthGuard],
    data: {
      roles: [Role.Admin, Role.Coach, Role.User]
    }
  },
  {
    path: 'blog',
    loadChildren: './modules/_core/blog/blog.module#BlogModule',
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
