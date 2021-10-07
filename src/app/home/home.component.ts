import { Component } from '@angular/core';

import { User } from '@app/_models';
import { AccountService } from '../_services/acount.service';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent {
    user: User;

    constructor(private accountService: AccountService){
        this.user = this.accountService.userValue;
    }
}