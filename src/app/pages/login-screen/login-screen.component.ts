import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthManagerService } from "../../services";
import { ToastrService } from "ngx-toastr";

@Component({
	selector: "app-login-screen",
	templateUrl: "./login-screen.component.html",
	styleUrls: ["./login-screen.component.scss"],
})
export class LoginScreenComponent implements OnInit {
	// UI Flag
	public showRegister = false;

	constructor(
		private router: Router,
		private authManager: AuthManagerService,
		private toastr: ToastrService
	) {}

	ngOnInit() {}

	public login(name: string, password: string) {
		// TODO add auth call
		this.authManager
			.login({ username: name, password: password })
			.then(response => {
				this.router.navigateByUrl("/game-list");
			})
			.catch(res => {
				this.toastr.error(res.message);
			});
	}

	public register(name: string, password: string) {
		this.authManager
			.register({ username: name, password: password })
			.then(response => {
				this.router.navigateByUrl("/game-list");
			})
			.catch(res => {
				this.toastr.error(res.message);
			});
	}
}
