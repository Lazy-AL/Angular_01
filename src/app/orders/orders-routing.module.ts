import { NgModule} from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { OrderListComponent } from './order-list/order-list.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
    {
      path: '', component: LayoutComponent,
        children:[
            {path:'',component: OrderListComponent},
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class OrderRoutingModule{}
