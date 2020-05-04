import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import { CreateUserComponent } from '../create-user/create-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { UsersService } from '../core/users.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/User';
import { By } from '@angular/platform-browser';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersComponent, CreateUserComponent ],
      imports: [FormsModule, ReactiveFormsModule]
    }).overrideComponent(CreateUserComponent, {set: {providers: [{provide: AuthService, useClass: AuthMock}]}})
    .overrideComponent(UsersComponent, {set: {providers: [{provide: UsersService, useClass: UserServiceMock}]}})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("shows test user", () => {
    let emailField = fixture.debugElement.query(By.css(".large-entry"))
    expect(emailField.nativeElement.innerText).toBe( "test@gmail.com")
  })
});


class AuthMock{
  public loginState
  logout() {
    this.loginState = false
  }
}

class UserServiceMock{
  public users: BehaviorSubject<User[]> = new BehaviorSubject([{uid: "12345",email: "test@gmail.com",isAdmin: true,isUser: true}]);
}