import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginScreenComponent } from './login-screen.component';

import { RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

const appRoutes: Routes = [
  { path: 'login', component: LoginScreenComponent }
];

describe('LoginScreenComponent', () => {
  let component: LoginScreenComponent;
  let fixture: ComponentFixture<LoginScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginScreenComponent],
      imports: [
        RouterModule.forRoot(appRoutes)
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
