import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthManagerService } from '../../services';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent implements OnInit {

  // UI Flag
  public showRegister = false;
  public name: string;
  public password: string;

  constructor(private router: Router, private authManager: AuthManagerService) { }

  ngOnInit() {
  }

  public login(name: string, password: string) {
    // TODO add auth call
    this.authManager.login({'username': this.name, 'password': this.password}).then(response => {
      this.router.navigateByUrl('/game-list');
    });
  }

  public register() {
    this.authManager.register({'username': this.name, 'password': this.password}).then(response => {
      this.router.navigateByUrl('/game-list');
    });
  }
}
