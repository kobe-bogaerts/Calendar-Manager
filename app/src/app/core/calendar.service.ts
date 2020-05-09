import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { WeekSerial } from '../model/WeekSerial';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private afs: AngularFirestore) {

  }

  setWeekForUser(userId: string, week: WeekSerial){
    let weekCollection = this.afs.collection("users").doc(userId).collection<WeekSerial>("weeks")
    const id = this.afs.createId()
    let weekDoc = weekCollection.doc(id);
    if(!week.uid){
      week.uid = id;
    }else{
      weekDoc = weekCollection.doc(week.uid);
    }
    return weekDoc.set(week);
  }

  getweekForUser(userId: string, beginDate: Date): Observable<WeekSerial[]>{
    beginDate.setHours(0,0);
    const weekCollection:AngularFirestoreCollection<WeekSerial> = this.afs.collection("users").doc(userId).collection<WeekSerial>("weeks", ref => ref.where("beginDate", ">=", beginDate));
    return weekCollection.valueChanges();
  }

  getweekForUserWithLimit(userId: string, beginDate: Date, limit: number): Observable<WeekSerial[]>{
    const weekCollection:AngularFirestoreCollection<WeekSerial> = this.afs.collection("users").doc(userId).collection<WeekSerial>("weeks", ref => ref.where("beginDate", ">=", beginDate).limit(limit));
    return weekCollection.valueChanges();
  }
}
