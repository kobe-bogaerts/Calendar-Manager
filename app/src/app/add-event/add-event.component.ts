
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventInput } from '@fullcalendar/core';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

  createForm: FormGroup;
  loading = false;
  submitted = false;

  @Output()
  closedDialog = new EventEmitter<void>();
  @Output()
  addEvent = new EventEmitter<EventInput>();
  @Output()
  updateEvent = new EventEmitter<EventInput>();
  @Input()
  eventBase: EventInput;

  isUpdate: boolean;

  constructor(private formBuilder: FormBuilder) { 
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      title: ['', Validators.required],
      beginDate: ['', Validators.minLength(1)],
      endDate: ['', Validators.minLength(1)]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.createForm.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.createForm.invalid) {
          return;
      }

      this.loading = true;
      //add event
      this.addEvent.emit(this.constructEvent(this.createForm.controls["title"].value, new Date(this.eventBase.start + ''), new Date(this.eventBase.end+'')));
      this.closedDialog.emit()
  }

  constructEvent(title: string, start: Date, end: Date): EventInput{
    let event: EventInput = {
      title: title,
      allDay: false,
      start: start,
      end: end
    }
    return event;
  }
}
