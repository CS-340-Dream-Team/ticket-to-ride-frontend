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

  constructor(private router: Router, private authManager: AuthManagerService) { }

  ngOnInit() {
  }

  public login(name: string, password: string) {
    // TODO add auth call
    console.log('Made login call from view');
    console.log(name + ' ' + password);
    this.authManager.login({'username': name, 'password': password}).then(response => {
      this.router.navigateByUrl('/game-list');
    });
  }

  public register(name: string, password: string) {
    console.log('Made register call from view');
    console.log(name + ' ' + password);
    this.authManager.register({'username': name, 'password': password}).then(response => {
      this.router.navigateByUrl('/game-list');
    });
  }
}
