import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  templateUrl: "./simple-form.component.html",
  styleUrls: ["./simple-form.component.css"]
})
export class SimpleFormComponent {
  simpleForm:FormGroup;
  uploadedImages = [];
  imagePreviewSrc = [];
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

  onFileSelected(event) {
    const file:File = event.target.files[0];

    if (file) {
      this.uploadedImages.push(file);
      this.displayImage(file);
    }
  }
  save() {

  }

  displayImage(file) {
    let fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.addEventListener('load', (event) => {
      this.imagePreviewSrc.push(event.target?.result);
    })
  }
}
