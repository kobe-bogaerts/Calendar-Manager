import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ResizehandlerComponent } from './utils/resizehandler/resizehandler.component';
import { AuthService } from './core/auth.service';
import { Observable } from 'rxjs';
import { SwUpdate } from '@angular/service-worker';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('AppComponent', () => {
  let navbar: DebugElement
  let fixture: ComponentFixture<AppComponent>
  let app: AppComponent
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        ResizehandlerComponent
      ],
    }).overrideComponent(AppComponent, {set: {providers: [{provide: AuthService, useClass: AuthMock}, {provide: SwUpdate, useClass: SWupdateMock}]}}).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    navbar = fixture.debugElement.query(By.css("ul"))
  }));

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it("is navbar displaying all nav links", () => {
    let childList = navbar.children
    expect(childList.length).toBe(3)
    app.auth.loginState = true
    fixture.detectChanges()
    childList = navbar.children
    expect(childList.length).toBe(4)
  })

  it("simulate call logout work", () => {
    spyOn(app.auth, "logout").and.callThrough()
    app.auth.loginState = true
    fixture.detectChanges()
    let childList = navbar.children
    expect(childList.length).toBe(4)
    app.auth.logout()
    expect(app.auth.loginState).toBeFalsy()
    expect(app.auth.logout).toHaveBeenCalled()
  })
});

class AuthMock{
  public loginState
  logout() {
    this.loginState = false
  }
}

class SWupdateMock{
  public available: Observable<void> = new Observable()
}

