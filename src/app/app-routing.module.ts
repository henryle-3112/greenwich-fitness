import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Role } from '@gw-models/core';

import { AuthGuard } from '@gw-services/core/guard/auth.guard';

import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from '@gw-share-module/core/forgot-password/forgot-password.component';
import { ActiveAccountComponent } from './pages/active-account/active-account.component';
import { AlertVerifyEmailComponent } from './pages/alert-verify-email/alert-verify-email.component';
import { RegisterComponent } from './pages/register/register.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';


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
