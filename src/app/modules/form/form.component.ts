import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryISO } from 'ngx-intl-tel-input';
import { ApiService } from 'src/app/services/api.service';




@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  bookingForm: FormGroup = new FormGroup({});
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.Bhutan, CountryISO.Nepal, CountryISO.Bangladesh];

  isDatePickerOpen: boolean = false;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.bookingForm = this.formBuilder.group({
      guest_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      guest_email: ['', [Validators.required, Validators.email]],
      guest_phone: ['', [Validators.required]],
      adults: ['', [Validators.required]],
      childrens: ['', [Validators.required]],
      booking_dates: ['', Validators.required]
    });
  }

  // Accessing form controls for convenience
  get formControls() {
    return this.bookingForm.controls;
  }

  // Handle form submission
  postBookingData() {
    if (this.bookingForm.valid) {
      // Form is valid, proceed with saving data
    } else {
      // Form is invalid, handle errors or display validation messages
    }
  }

  onReset() {
    this.bookingForm.reset({
      guest_name: '',
      guest_email: '',
      guest_phone: '',
      adults: '',
      childrens: ''
    });
  }


  //For Calender
  toggleDatePicker(): void {
    this.isDatePickerOpen = !this.isDatePickerOpen;
  }
  
  onDatePickerOpen(): void {
    this.isDatePickerOpen = true;
  }
  
  onDatePickerClose(): void {
    this.isDatePickerOpen = false;
  }


}
