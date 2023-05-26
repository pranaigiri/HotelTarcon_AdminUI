import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryISO } from 'ngx-intl-tel-input';
import { ApiService } from 'src/app/services/api.service';



  // Email validator using regex pattern
  export function emailValidator(control: FormControl): { [key: string]: any } | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(control.value) ? null : { invalidEmail: true };
  }
  

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  showModal = false;
  bookingForm: FormGroup = new FormGroup({});
  roomCategories: any[] = [
    { room_category_id: 1, room_category: 'Standard Room', price: 100 },
    { room_category_id: 2, room_category: 'Deluxe Room', price: 150 },
    { room_category_id: 3, room_category: 'Suite', price: 200 }
  ];
  submitted = false;
  showErrorAlert = false;
  errorMsg:string="Error: Please fill in all the required fields correctly.";
  constructor(private formBuilder: FormBuilder,private datePipe: DatePipe,private apiService: ApiService) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.bookingForm = this.formBuilder.group({
      guest_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      // guest_email: ['', [Validators.required, Validators.email]],
      guest_email: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      guest_phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      adults: ['', [Validators.required]],
      childrens: ['', [Validators.required]],
      guest_address: ['', [Validators.required]],
      check_out: [this.getCurrentDate(), Validators.required],
      check_in: [this.getCurrentDate(), Validators.required],
      roomCategory:['', [Validators.required]],

    });
  }

  getCurrentDate(): string {
    const today = new Date();
    return this.datePipe.transform(today, 'yyyy-MM-dd')!;
  }

  // Accessing form controls for convenience
  get formControls() {
    return this.bookingForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.bookingForm.invalid) {
      this.showErrorAlert = true;
      this.apiService.handleLoginError(this.errorMsg);

    } else {
      // Form is valid, proceed with form submission
      this.postBookingData();
    }
  }

  // Handle form submission
  postBookingData() {
    if (this.bookingForm.valid) {
      alert("Valid")
      // Form is valid, proceed with saving data
    } else {
      alert("InValid")
      // Form is invalid, handle errors or display validation messages
    }
  }

  onReset() {
    this.bookingForm.reset({
      guest_name: '',
      guest_email: '',
      guest_phone: '',
      adults: '',
      childrens: '',
      check_out:this.getCurrentDate(),
      check_in:this.getCurrentDate(),
      roomCategory:'',
      guest_address:''
    });
    this.submitted = false;
    this.showErrorAlert = false;
  }

  
  closeModal() {
    this.showModal = false;
  }




}
