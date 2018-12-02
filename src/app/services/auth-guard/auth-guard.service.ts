import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AuthManagerService } from "../auth-manager/auth-manager.service";

@Injectable()
export class AuthGuardService implements CanActivate {
	constructor(public auth: AuthManagerService, public router: Router) {}

	public canActivate(): boolean {
		if (!this.auth.isAuthenticated()) {
			this.router.navigate(["login"]);
			return false;
		}
		return true;
	}
}
