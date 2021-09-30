import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";


@Injectable({
    providedIn: 'root'
})

export class RoleGuard implements CanActivate {
    canActivate() {
        let role = JSON.parse(localStorage.getItem("user")).role;
        if(role == "Admin"){
            console.log(role)

            return true;
        }
        else if(role == "Mod"){
            console.log(role)

            return true;
        }
        alert ('no permissions')
        return false;
    }
}
