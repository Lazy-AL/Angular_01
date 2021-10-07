import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {HomeComponent} from './home';
import { OrdersComponent } from './orders/orders.component';
import {AuthGuard} from './_helpers';
import {RoleGuard} from './_helpers/role.gouard';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const productsModule = () => import('./users/users.module').then(x => x.UsersModule);


const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'users', loadChildren: usersModule, canActivate: [RoleGuard]},
  {path: 'account', loadChildren: accountModule},
  {path: 'orders', component: OrdersComponent, canActivate: [AuthGuard]},


  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
