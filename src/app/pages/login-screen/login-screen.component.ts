import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public login() {
    // TODO add auth call
    this.router.navigateByUrl('/game-list');
  }

}
