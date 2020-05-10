import { Component, OnInit, OnDestroy, ViewChildren, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import _ from 'lodash';
import { UsersService } from '../core/users.service';
import { User } from '../model/User';
import { Subscription } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { Week } from '../model/Week';
import {duration} from 'moment';
import { CalendarService } from '../core/calendar.service';
import { WeekSerializer } from '../model/WeekSerial';
import { ResizeService } from '../utils/resize.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChildren('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template

  showAddEvent:boolean;
  currentEventBase: EventInput;
  allUsers: User[];
  private weekRange;
  private sub: Subscription;
  private subCalendar: Subscription[] = [];
  calendarVisible: boolean = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  currentSelectedUserID: string;
  weekList: Map<string, Week[]> = new Map<string, Week[]>();
  currentWeekIndex: number = -1;
  private currentDisplayedDate: Date;
  private isWeekMode: boolean = true;
  private dayIndex: number = 0;
  isMobile: boolean;

  calendarOptions = {
    minTime: duration("06:00:00"),
    maxTime: duration("19:00:00"),
    droppable: true,
    editable: true,
    weekends: false,
    allDayShow: false,
  }


  constructor(private userService: UsersService, public auth: AuthService, private calendarService: CalendarService, private resizeService: ResizeService, private cdRef: ChangeDetectorRef){
    this.resizeService.onResize$.subscribe(isMobile=> {
      if(isMobile)
        this.isWeekMode = false;
      this.isMobile = isMobile
    })

    this.currentSelectedUserID = this.auth.lastUser.uid;
    this.currentDisplayedDate = new Date();
    this.weekRange = this.getWeekRange(this.currentDisplayedDate);
  }

  ngOnInit(){
    if(this.auth.lastUser.isAdmin){
      this.sub = this.userService.users.subscribe(data=>{
        this.allUsers = data;
        this.getAllUserCalendarWeekData();
        this.cdRef.detectChanges();
      })
    }else{
      this.calendarOptions.droppable = false;
      this.calendarOptions.editable = false;
    }
    
    //get data from fb
    let weeks: Week[];

    if(!this.allUsers){
      //create observable for last user or so
      this.subCalendar.push(this.calendarService.getweekForUser(this.currentSelectedUserID, this.weekRange.weekStart).subscribe(data=>{
        if(!data || data.length == 0)
            weeks = [].concat(Object.assign({}, this.getWeekCopy()));
          else
            weeks = WeekSerializer.parseWeeks(data);
        this.weekList.set(this.currentSelectedUserID, weeks);
        this.calcWeekIndex();
        this.cdRef.detectChanges();
      }));
    }
  }

  ngAfterViewInit(){
    this.addEventListenersToNextPrev();
    this.addEventListenersToWeekDay();
  }

  ngOnDestroy(){
    if(this.sub)
      this.sub.unsubscribe();
    for (const sub of this.subCalendar) {
      sub.unsubscribe();
    }
  }

  private getAllUserCalendarWeekData(){    
    //get data from fb
    let weeks: Week[];

    if(this.allUsers){
      for(let user of this.allUsers){
        this.subCalendar.push(this.calendarService.getweekForUser(user.uid, this.weekRange.weekStart).subscribe(data=>{ 
          if(!data || data.length == 0)
            weeks = [].concat(Object.assign({}, this.getWeekCopy()));
          else
            weeks = WeekSerializer.parseWeeks(data);
          this.weekList.set(user.uid, weeks);
          if(this.currentSelectedUserID === user.uid && this.currentWeekIndex == -1)
            this.currentWeekIndex = this.calcWeekIndex();
          this.cdRef.detectChanges();
        }));
      }
    }
  }

  private getWeekRange(d: Date) {
    const day = d.getDay();
    const diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    let startDate = new Date(d.setDate(diff));
    startDate.setHours(0, 0, 0);
    let endDate = new Date(d);
    endDate.setHours(23, 59, 59);
    endDate.setDate(endDate.getDate()+6);
    return {weekStart: startDate, weekEnd: endDate};
  }

  handleDateClick(arg) {
    if(this.auth.isAdmin()){
      let endDate: Date = new Date(arg.date);
      endDate.setHours(endDate.getHours()+1);
      this.currentEventBase = {
        title: "",
        start: arg.date,
        end: endDate
      };
      this.openAddEvent();
    }
  }

  eventClicked(event){
    if(this.auth.isAdmin()){
      let endDate: Date = new Date(event.event._instance.range.end);
      endDate.setHours(endDate.getHours()-1);
      let startDate: Date = new Date(event.event._instance.range.start);
      startDate.setHours(startDate.getHours()-1);
      this.currentEventBase = {
        title: event.event._def.title,
        start: startDate,
        end: endDate
      };
      this.openAddEvent();
    }
  }

  openAddEvent(){
    this.showAddEvent = true;
  }

  closeAddEvent(){
    this.showAddEvent = false;
  }

  addEvent(event: EventInput){
    let index = this.getCurrentWeekData().findIndex((temp)=>{
      return temp.start && temp.end && new Date(temp.end.toString()).getTime() === new Date(event.end.toString()).getTime() && new Date(temp.start.toString()).getTime() === new Date(event.start.toString()).getTime();
    })
    if(index == -1)
      this.setCurrentWeekData(this.getCurrentWeekData().concat(event));
    else{
      let clone = this.getCurrentWeekData().slice();
      clone[index] = event;
      this.setCurrentWeekData(clone);
    }
  }

  onDragStop(event){
    const domCalendar = document.querySelector(".fc-left .app-calendar");
    if(domCalendar){
      let calendarRec = domCalendar.getBoundingClientRect();

      if(calendarRec && event.jsEvent.x < calendarRec.left || event.jsEvent.x > calendarRec.right || event.jsEvent.y > calendarRec.bottom || event.jsEvent.y < calendarRec.top){
        this.setCurrentWeekData(this.getCurrentWeekData().filter((temp)=>{
          let startDate = new Date(event.event._instance.range.start);
          startDate.setHours(startDate.getHours() - 1);
          let endDate = new Date(event.event._instance.range.end);
          endDate.setHours(endDate.getHours() - 1);
          
          return !(_.isEqual(temp.start, startDate) && _.isEqual(temp.end, endDate) && temp.title === event.event._def.title);
        }))
      }
    }
  }

  eventResized(event){
    let startDate = new Date(event.event._instance.range.start);
    startDate.setHours(startDate.getHours() - 1);
    let endDate = new Date(event.event._instance.range.end);
    endDate.setHours(endDate.getHours() - 1);
    let index = this.getCurrentWeekData().findIndex((temp)=>{
      return !(_.isEqual(temp.start, startDate) && _.isEqual(temp.end, endDate) && temp.title === event.event._def.title);
    })
    if(index > -1){
      let clone = this.getCurrentWeekData().slice();
      let cloneEvent = clone[index];
      cloneEvent.start = startDate;
      cloneEvent.end = endDate;
      clone[index] = cloneEvent;
      this.setCurrentWeekData(clone);
    }
  }

  private addEventListenersToNextPrev(){
    let buttons = document.querySelector(".fc-left .fc-button-group").children;
    buttons[0].addEventListener("click", (e)=>{
      if(this.isWeekMode){
        //remove a week
        let date = this.currentDisplayedDate;
        this.subWeekToDate(date);
        this.weekRange = this.getWeekRange(date);
        this.currentWeekIndex--;
      }else{
        if(this.dayIndex > 0){
          this.dayIndex--;
        }else{
          this.dayIndex = 4;
          this.currentWeekIndex--;
        }
      }
    });
    buttons[1].addEventListener("click", (e)=>{
      if(this.isWeekMode){
        this.currentWeekIndex++;
        //add a week
        let date = this.currentDisplayedDate;
        this.addWeekToDate(date);
        this.weekRange = this.getWeekRange(date);
        if(!this.getCurrentWeek()){
          if(this.allUsers){
            for(let user of this.allUsers){
              this.weekList.get(user.uid).push(this.getWeekCopy());
            }
            this.setCurrentWeekData([]);
          }else{
            this.weekList.get(this.currentSelectedUserID).push(this.getWeekCopy());
          }
        }
      }else{
        if(this.dayIndex < 4){
          this.dayIndex++;
        }else{
          this.dayIndex = 0;
          this.currentWeekIndex++;
        }
      } 
    });
  }

  private addEventListenersToWeekDay(){
    let buttons = document.querySelector(".fc-right .fc-button-group").children;
    buttons[0].addEventListener("click", (e)=>{
      this.isWeekMode = true;
    });
    buttons[1].addEventListener("click", (e)=>{
      this.isWeekMode = false;
    });
  }

  private calcWeekIndex(){
    if(this.weekList.get(this.currentSelectedUserID)){
      let date = new Date(this.weekList.get(this.currentSelectedUserID)[0].beginDate.seconds * 1000);
      if(date){
        let deltaTime = this.currentDisplayedDate.getTime() - date.getTime();
        if(!Number.isNaN(deltaTime))
          return Math.ceil(deltaTime / 604800000);
      }
    }
    return 0;
  }

  private addWeekToDate(date: Date){
    date.setDate(date.getDate() + 7);
  }

  private subWeekToDate(date: Date){
    date.setDate(date.getDate() - 7);
  }

  private getWeekCopy(): Week {
    const week: Week = {
      beginDate: this.weekRange.weekStart,
      endDate: this.weekRange.weekEnd,
      data: []
    };
    return week;
  }

  private getCurrentWeek(): Week{
    return this.weekList.get(this.currentSelectedUserID)[this.currentWeekIndex > -1 ? this.currentWeekIndex : 0];
  }

  getCurrentWeekData(): EventInput[]{
    const week = this.weekList.get(this.currentSelectedUserID);
    if(this.currentWeekIndex > -1){
      if(week && week[this.currentWeekIndex]){
        return week[this.currentWeekIndex].data;
      }
    }
    return [];
  }

  private setCurrentWeekData(data: EventInput[]){
    
    let weekFromList = this.weekList.get(this.currentSelectedUserID)[this.currentWeekIndex];
    if(!weekFromList){
      do{
        this.weekList.get(this.currentSelectedUserID).push(this.getWeekCopy());
        weekFromList = this.weekList.get(this.currentSelectedUserID)[this.currentWeekIndex];
      } while(!weekFromList);
    }
    weekFromList.data = data;
    this.calendarService.setWeekForUser(this.currentSelectedUserID, WeekSerializer.serializeWeek(this.getCurrentWeek()));
  }
}
