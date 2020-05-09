import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { UsersService } from '../core/users.service';
import { User } from '../model/User';
import { Subscription } from 'rxjs';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

  usersList: User[] = [];
  updateList: User[] = [];
  subscription: Subscription;
  openCreateUserVar: boolean;

  constructor(public userService: UsersService, private cdRef: ChangeDetectorRef) { 
    this.subscription = this.userService.users.subscribe(users=> {
      this.usersList = users;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    if(this.subscription)
      this.subscription.unsubscribe();
  }

  save(){
    if(this.updateList.length > 0){
      this.userService.updateBatch(this.updateList);
    }
  }

  selectChange(e){
    let updatedUser: User = this.usersList[e.target.id];
    if(e.target.value == "admin"){
      updatedUser.isAdmin = true;
    }else{
      updatedUser.isAdmin = false;
    }
    this.updateList.push(updatedUser);
    this.usersList[e.target.id] = updatedUser;
    this.updateList = [...new Set(this.updateList)];
  }

  openCreateUser(){
    this.openCreateUserVar = true;
  }

  closeCreateUser(){
    this.openCreateUserVar = false;
  }

  createdUser(user: User){
    this.usersList.push(user);
    this.userService.updateUser(user, true);
  }

}
