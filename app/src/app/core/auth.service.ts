import { Injectable } from '@angular/core';
import {Router} from '@angular/router'
import {AngularFireAuth } from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore'
import { Observable, of, Subscription} from 'rxjs';
import {User, LoginStore} from '../model/User'
import { switchMap, take, last } from 'rxjs/operators';
import { LocalStorageService } from './local-storage-service';
import { CryptoService } from './crypto.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User>;
  public loginState: boolean;
  public lastUser: User;
  private loginStore: LoginStore;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router, private localStorage: LocalStorageService, private crypto: CryptoService) { 
    this.user = this.afAuth.authState.pipe(switchMap(user => {
        if(user){
          this.loginState = true
          //valueChanges() this will get observable
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges().pipe(take(2))
        }else{
          this.loginState = false
          return of(null)
        }
    }))
    this.user.subscribe(user =>{
      this.lastUser = user;
    })
  }

  login(email: string, password: string): Promise<firebase.auth.UserCredential>{
    this.loginStore = {pass: password, username: email};
    this.localStorage.putPermenantString("comfirm", this.crypto.generateHmac(this.loginStore));
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).then(user => {
      this.updateUserData(user.user)
      this.router.navigate([""])
      return Promise.resolve(user);
    })
  }

  private updateUserData(user) {
    const userRef : AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      isAdmin: false,
      isUser: true
    }
    if(this.isAdmin())
      userRef.set(data, {mergeFields:[]}).catch(err=> console.log("oops no admin to update"));
  }

  async createUser(email: string, password: string): Promise<firebase.auth.UserCredential>{
    let ret = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    await this.afAuth.auth.signOut();
    await this.afAuth.auth.signInWithEmailAndPassword(this.loginStore.username, this.loginStore.pass);
    this.loginStore = null;
    return ret;
  }

  logout(){
    this.afAuth.auth.signOut().then(()=> {
      this.loginStore = null;
      this.localStorage.removePermenant("comfirm");
      this.user = of(null);
      this.loginState = false;
      this.localStorage.remove("users");
      this.router.navigate(["/login"]);
    });
  }

  storePass(pass: string): boolean{
    try{
      if(!pass) 
        return false;
      this.loginStore = {pass: pass, username: this.lastUser.email};
      let hash = this.crypto.generateHmac(this.loginStore);
      return this.localStorage.getPermenantString("comfirm") === hash;
    }catch{
      return false;
    }
  }

  isAdmin(): boolean {
    return this.lastUser && this.lastUser.isAdmin
  }
}
