import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { SignService } from "./sign.service";
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if(localStorage.getItem('bearer') && localStorage.getItem('username')){
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        //this.router.navigate([''], { queryParams: { returnUrl: state.url }});
        this.router.navigate(['/home']);
        return false;
    }

}
