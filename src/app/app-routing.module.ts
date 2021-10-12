import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home';
import {AuthGuard} from './_helpers';
import {RoleGuard} from './_helpers/role.gouard';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const ordersModule = () => import('./orders/orders.module').then(x=>x.OrderModule)

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'users', loadChildren: usersModule, canActivate: [RoleGuard]},
  {path: 'account', loadChildren: accountModule},
  {path: 'orders', loadChildren:ordersModule},


  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
