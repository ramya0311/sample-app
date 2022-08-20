import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  templateUrl: "./simple-form.component.html",
  styleUrls: ["./simple-form.component.css"]
})
export class SimpleFormComponent {
  simpleForm:FormGroup;

  constructor() {}

  ngOnInit() {
    this.simpleForm = new FormGroup({
      email: new FormControl('',[Validators.required, Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{1,}$')]),
      firstName: new FormControl('',[Validators.required]),
      lastName: new FormControl('',[Validators.required]),
      description: new FormControl('',[Validators.required]),
    });
  }

  isVaildField(fieldName) {
   return this.simpleForm.controls[fieldName].invalid && this.simpleForm.controls[fieldName].touched && this.simpleForm.controls[fieldName].errors.required;
  }

  isVaildFieldEmail() {
    return this.simpleForm.controls['email'].touched && this.simpleForm.controls['email'].errors && this.simpleForm.controls['email'].hasError('pattern');
  }
  save() {

  }

  addImage() {

  }
}
