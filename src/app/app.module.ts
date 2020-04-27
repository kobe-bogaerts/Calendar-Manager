import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy} from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';


//own imports
import { AppComponent } from './app.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CoreModule } from './core/core.module';
import {AuthGuard} from './core/auth.guard';
import {AdminGuard} from './core/admin.guard';
import { UsersComponent } from './users/users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { AddEventComponent } from './add-event/add-event.component';
import { AutoFocusDirectiveDirective } from './directives/auto-focus-directive.directive';
import { ResizehandlerComponent } from './utils/resizehandler/resizehandler.component';
import { ServiceWorkerModule } from '@angular/service-worker'; 

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersComponent, canActivate: [AdminGuard]},
  { path: '', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: '**', component: LoginComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CalendarComponent,
    UsersComponent,
    CreateUserComponent,
    AddEventComponent,
    AutoFocusDirectiveDirective,
    ResizehandlerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    FullCalendarModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    RouterModule.forRoot(
      appRoutes,
      {useHash: true}
      // { enableTracing: true } // <-- debugging purposes only
    ),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    // .enablePersistence() for offline
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
