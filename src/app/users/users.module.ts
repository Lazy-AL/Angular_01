import { NgModule } from '@angular/core';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from '././add/add-edit.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UsersRoutingModule,
        FormsModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        AddEditComponent
        
    ]
})
export class UsersModule { }