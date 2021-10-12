import { NgModule } from '@angular/core';import { RouterModule } from '@angular/router';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderRoutingModule } from './orders-routing.module';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
    imports:[
        CommonModule,
        ReactiveFormsModule,
        OrderRoutingModule,
        FormsModule
    ],
    declarations: [
        OrderListComponent,
        LayoutComponent
    ]
})
export class OrderModule{}
