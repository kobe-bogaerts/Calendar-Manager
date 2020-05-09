import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { AuthService } from '../core/auth.service';
import { User } from '../model/User';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  createForm: FormGroup;
  loading = false;
  submitted = false;

  @Output()
  userCreated = new EventEmitter<User>();
  @Output()
  closedDialog = new EventEmitter<void>();

  constructor(public auth: AuthService, private formBuilder: FormBuilder) { 
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password_conf: ['', Validators.required]
  });
  }

  // convenience getter for easy access to form fields
  get f() { return this.createForm.controls; }

  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.createForm.invalid) {
        return;
    }

    if(this.createForm.controls["password"].value !== this.createForm.controls["password_conf"].value){
      this.createForm.controls["password_conf"].setErrors({"not_same": true})
      return;
    }

    const { value: password } = await Swal.fire({
      title: 'Enter your password',
      input: 'password',
      inputPlaceholder: 'Enter your password',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      }
    })

    if(this.auth.storePass(password)){

      this.loading = true;
      this.auth.createUser(this.f.username.value, this.f.password.value).then(data => {
        this.loading = false;
        
        const user: User = {
          uid: data.user.uid,
          email: data.user.email,
          isAdmin: false,
          isUser: true
        }
        this.userCreated.emit(user)
        this.closedDialog.emit()
      }).catch(err=>{
        console.warn(err);
        this.createForm.controls["password"].setErrors({"weak": true})
        this.loading = false;
      })
    }
  }

}
