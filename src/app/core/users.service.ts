import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from '../model/User';
import { Observable, of, BehaviorSubject } from 'rxjs';
import _ from 'lodash';
import { LocalStorageService } from './local-storage-service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersCollection: AngularFirestoreCollection<User>;
  users: BehaviorSubject<User[]> = new BehaviorSubject([]);

  updateBatch(users: User[]){
    this.localStorage.putObject("users", _.unionWith(this.localStorage.getObject("users"), users, _.isEqual));
    users.forEach(user => {
      this.updateUser(user);
    });
  }

  updateUser(user: User, createUser: boolean = false) {
    if(!createUser){
      const tempUser = <User[]>this.localStorage.getObject("users");
      this.localStorage.putObject("users", tempUser.concat(user));
      this.usersCollection.doc(user.uid).update(user).catch(err=>console.warn("update crashed", err));
    }
    else
      this.usersCollection.doc(user.uid).set(user).catch(err=>console.warn("update crashed", err));
  }

  constructor(private afs: AngularFirestore, private localStorage: LocalStorageService) { 
    this.usersCollection = this.afs.collection<User>('users');
    let cachedUsers = this.localStorage.getObject("users");
    if(!cachedUsers){
      this.usersCollection.valueChanges().subscribe(data=>{
        if(this.users)
          this.users.next(data);
        this.localStorage.putObject("users", data);
      });
    }else{
      this.users.next(<User[]>cachedUsers);
    }
  }
}
