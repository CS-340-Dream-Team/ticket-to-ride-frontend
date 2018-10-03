import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListedGameComponent } from './listed-game.component';

describe('ListedGameComponent', () => {
  let component: ListedGameComponent;
  let fixture: ComponentFixture<ListedGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListedGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListedGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
