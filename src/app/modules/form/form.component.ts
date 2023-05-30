import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { error } from 'console';
import { ApiService } from 'src/app/services/api.service';




@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  showModal = false;
  bookingForm: FormGroup = new FormGroup({});
  roomCategories: any[] = [
    { room_category_id: 1, room_category_name: 'Standard Room', room_category_price: 0 },
    { room_category_id: 2, room_category_name: 'Deluxe Room', room_category_price: 0 },
    { room_category_id: 4, room_category_name: 'Hill View Room', room_category_price: 0 },
    { room_category_id: 3, room_category_name: 'Suite', room_category_price: 0 }
  ];
  submitted = false;
  showErrorAlert = false;
  errorMsg: string = "Error: Please fill in all the required fields correctly.";
  isFormSubmittedSuccessfully: boolean = false;
  IsEditRequestedID: string = "0";
  EditFromData: any = {};
  ViewData:any={
    daysdiff:0,
    overallprice:0,
    gst_percentile:0,
    total_room_price:0,
    room_price:0
  }
  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe, private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.initializeForm();

    this.route.params.subscribe(params => {
      this.IsEditRequestedID = params['id'];
      console.log("Fetch Booking")
      if (this.IsEditRequestedID != "0") {
        //IF Edit Requested
        this.GetBookingByBookingId();
      }
    });

    this.GetAllRoomCategories();
  }

  initializeForm() {
    console.log("Form Initialization", this.getCurrentDate());

    this.bookingForm = this.formBuilder.group({
      guest_name: [this.IsEditRequestedID == "0" ? '' : this.EditFromData.data.guests.guest_name, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      guest_email: [this.IsEditRequestedID == "0" ? '' : this.EditFromData.data.guests.guest_email, [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      guest_phone: [this.IsEditRequestedID == "0" ? '' : this.EditFromData.data.guests.guest_phone, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      adults: [this.IsEditRequestedID == "0" ? '' : this.EditFromData.data.guests.adults, [Validators.required]],
      idproof: ['', [Validators.required]],
      idproofvalue: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('')]],
      childrens: [this.IsEditRequestedID == "0" ? '' : this.EditFromData.data.guests.childrens, [Validators.required]],
      guest_address: [this.IsEditRequestedID == "0" ? '' : this.EditFromData.data.guests.guest_address, [Validators.required]],
      check_out: [this.IsEditRequestedID == "0" ? this.getCurrentDate() : this.datePipe.transform(this.EditFromData.data.booking.booking_till, "yyyy-MM-dd"), Validators.required],
      check_in: [this.IsEditRequestedID == "0" ? this.getCurrentDate() : this.datePipe.transform(this.EditFromData.data.booking.booking_from, "yyyy-MM-dd"), Validators.required],
      roomCategory: [this.IsEditRequestedID == "0" ? '' : this.EditFromData.data.booking.room_category_id, [Validators.required]],

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
    this.isFormSubmittedSuccessfully = false;
    this.submitted = true;
    if (this.bookingForm.invalid) {
      this.submitted = false;
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

      console.log("Form Valid !");

      this.ViewData.daysdiff = this.CalculateNoOfDays();
      this.ViewData.overallprice = this.OverAllPriceCalculation(Number(this.bookingForm.value.roomCategory), this.ViewData.daysdiff);

      //Initialising Data
      let postObj: any = {
        booking_id: 'asdasd',
        booking_date: new Date(),
        // booking_from: this.bookingForm.value.check_in,
        booking_from: new Date(this.bookingForm.value.check_in),
        booking_till: new Date(this.bookingForm.value.check_out),
        // booking_till: this.bookingForm.value.check_out,
        room_category_id: this.bookingForm.value.room_category_id,
        booking_mode: 'offline',
        total_amount: 20,
        paid_amount: 0,
        due_amount: 0,
        payment_status: 'Paid',
        upi_id: 'cbpankajrawat@ybl',
        guest_id: 0,
        guest_name: this.bookingForm.value.guest_name,
        guest_phone: this.bookingForm.value.guest_phone,
        guest_address: this.bookingForm.value.guest_address,
        guest_email: this.bookingForm.value.guest_email,
        guest_total: Number(this.bookingForm.value.adults) + Number(this.bookingForm.value.childrens),
        adults: this.bookingForm.value.adults,
        childrens: this.bookingForm.value.childrens
      };

      this.apiService.postData("Booking/OfflineBooking", postObj).subscribe((res: any) => {
        console.log("Response Success !");
        this.isFormSubmittedSuccessfully = true;
      },
        (error: any) => {
          this.isFormSubmittedSuccessfully = false;
        })
      // Form is valid, proceed with saving data


    } else {
      console.log("InValid Form Details")
      // Form is invalid, handle errors or display validation messages
    }
  }

  onReset() {
    this.bookingForm.reset({
      guest_name: '',
      guest_email: '',
      guest_phone: '',
      adults: '',
      idproof: '',
      idproofvalue: '',
      childrens: '',
      check_out: this.getCurrentDate(),
      check_in: this.getCurrentDate(),
      roomCategory: '',
      guest_address: ''
    });
    this.submitted = false;
    this.showErrorAlert = false;
    this.isFormSubmittedSuccessfully = false;
    this.setValidationPattern();
  }


  closeModal() {
    this.showModal = false;
  }

  GetAllRoomCategories() {
    this.apiService.getData("Common/GetAllRoomCategories").subscribe((res: any) => {
      console.log("Response Success GetAllRoomCategories!");
      this.roomCategories = res.result;
    })
  };


  CalculateNoOfDays(): number {
    const date1 = new Date(this.bookingForm.value.check_out);
    const date2 = new Date(this.bookingForm.value.check_in);

    // Calculate the time difference in milliseconds
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());

    // Convert milliseconds to days
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    console.log(daysDiff);

    return daysDiff == 0 ? 1 : daysDiff;
  }


  //TODO 
  OverAllPriceCalculation(room_category_id: number, noofdays: number): any {
    //Room Price
    let room_price = Number(this.roomCategories.find(x => x.room_category_id === room_category_id)?.room_category_price);
    this.ViewData.room_price=room_price;

    //Total Price
    let total_room_price = room_price * Number(noofdays);
    this.ViewData.total_price=total_room_price;

    //Gst Percentile
    let gst = this.getGSTPercentage(total_room_price);
    this.ViewData.gst_percentile=gst;

    let overallprice = total_room_price * gst;
    return overallprice;
  }





  setValidationPattern() {
    const idProofControl = this.bookingForm.get('idproof')!;
    const idNumberControl = this.bookingForm.get('idproofvalue')!;

    idNumberControl.enable();


    if (idProofControl.value === 'Aadhar') {
      idNumberControl.setValidators([Validators.required, Validators.pattern('^[0-9]{12}$')]);
    } else if (idProofControl.value === 'VoterCard') {
      idNumberControl.setValidators([Validators.required, Validators.pattern('^[A-Z]{3}[0-9]{7}$')]);
    } else if (idProofControl.value === 'PanCard') {
      idNumberControl.setValidators([Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]);
    } else {
      idNumberControl.disable();
      idNumberControl.clearValidators();
    }

    idNumberControl.updateValueAndValidity();
  }


  async GetBookingByBookingId() {
    this.EditFromData = {};
    await this.apiService.getDataById("Booking/GetBookingBySearchParam", this.IsEditRequestedID).subscribe((res: any) => {
      console.log("Edit : From Fetched Sucessfully !");
      this.EditFromData = res.result;
      this.initializeForm();
    }, (error: any) => {
      this.initializeForm();
    })
  }

  getGSTPercentage(price:number) {
    let gstPercentage;
  
    if (price <= 5000) {
      gstPercentage = 5;
    } else if (price <= 10000) {
      gstPercentage = 12;
    } else {
      gstPercentage = 18;
    }
  
    return gstPercentage;
  }




}
