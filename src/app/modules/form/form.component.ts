import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  roomCategories: any[] = [];
  submitted = false;
  showErrorAlert = false;
  errorMsg: string = "Error: Please fill in all the required fields correctly.";
  isFormSubmittedSuccessfully: boolean = false;
  IsEditRequestedID: string = "0";
  EditFromData: any = {};
  ViewData: any = {
    daysdiff: 0,
    overallprice: 0,
    gst_percentile: 0,
    total_room_price: 0,
    room_price: 0
  }
  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe,
     private apiService: ApiService, private route: ActivatedRoute,private router:Router) { }

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
  roomCategoryName: string = '';

  GetAllRoomCategories() {
    this.apiService.getData("Common/GetAllRoomCategories").subscribe((res: any) => {
      console.log("Response Success GetAllRoomCategories!");
      this.roomCategories = res.result;

      // Populate room_category_name based on room_category_id
      this.roomCategories.forEach((category: any) => {
        const selectedCategory = this.roomCategories.find((c: any) => c.room_category_id === category.room_category_id);
        category.room_category_name = selectedCategory ? selectedCategory.room_category_name : '';
      });

      console.log(this.roomCategories);

      // Assign the selected room category name to the form control value
      const roomCategoryId = this.bookingForm.controls['roomCategory'].value;
      const selectedCategory = this.roomCategories.find(category => category.room_category_id === roomCategoryId);
      const roomCategoryName = selectedCategory ? selectedCategory.room_category_name : '';
      this.bookingForm.controls['roomCategory'].setValue(roomCategoryName);
    });
  }



  initializeForm() {
    console.log("Form Initialization", this.getCurrentDate());
    this.bookingForm = this.formBuilder.group({
      guest_name: [this.IsEditRequestedID == "0" ? '' : this.EditFromData.guest_name, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      guest_email: [this.IsEditRequestedID == "0" ? '' : this.EditFromData.guest_email, [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      guest_phone: [this.IsEditRequestedID == "0" ? '' : this.EditFromData.guest_phone, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      adults: [this.IsEditRequestedID == "0" ? '' :  this.EditFromData.adults == 0 ? '' : this.EditFromData.adults, [Validators.required]],
      idproof: [this.IsEditRequestedID === "0" ? '' : this.EditFromData.document_type == null ? '' : this.EditFromData.document_type, [Validators.required]],
      idproofvalue: [{ value: this.IsEditRequestedID === "0" ? '' : this.EditFromData.document_uniqueid == null ? '' : this.EditFromData.document_uniqueid, disabled: true }, [Validators.required, Validators.pattern('')]],
      childrens: [this.IsEditRequestedID == "0" ? '' : this.EditFromData.childrens == 0 ? '' : this.EditFromData.childrens, [Validators.required]],
      guest_address: [this.IsEditRequestedID == "0" ? '' : this.EditFromData.guest_address, [Validators.required]],
      check_out: [this.IsEditRequestedID == "0" ? this.getCurrentDate() : this.datePipe.transform(this.EditFromData.checkout, "yyyy-MM-dd"), Validators.required],
      check_in: [this.IsEditRequestedID == "0" ? this.getCurrentDate() : this.datePipe.transform(this.EditFromData.checkin, "yyyy-MM-dd"), Validators.required],
      roomCategory: [this.IsEditRequestedID === "0" ? '' : this.EditFromData.room_category_id == 0 ? '' :this.EditFromData.room_category_id , Validators.required],
      roomPrice: [this.IsEditRequestedID === "0" ? '' : parseFloat(this.EditFromData.room_category_price) || 0],
      bookingMode: [this.IsEditRequestedID === "0" ? '' : this.EditFromData.booking_mode, Validators.required],
      upi_id: [this.IsEditRequestedID === "0" ? '' : this.EditFromData.upi_id, [Validators.pattern(/^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/)]],
      transaction_id: [this.IsEditRequestedID === "0" ? '' : this.EditFromData.transaction_id, [Validators.pattern(/^\d[A-Z]\d{2}[A-Z]\d{3}[A-Z]{2}$/)]],
      paymentStatus: ['', Validators.required],
      partialPaymentAmount: ['']


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
      // this.submitted = false;
      this.showErrorAlert = true;
      this.apiService.handleLoginError(this.errorMsg);

    } else {
      // Form is valid, proceed with form submission
      this.postBookingData();
    }
  }
  totalPrice: number = 0;




  // Handle form submission
  postBookingData() {
    if (this.bookingForm.valid) {

      console.log("Form Valid !");


      this.ViewData.daysdiff = this.CalculateNoOfDays();
      this.ViewData.overallprice = this.OverAllPriceCalculation(Number(this.bookingForm.value.roomCategory), this.ViewData.daysdiff);
      // Calculate the overall price and total room price
      let calculationResult = this.OverAllPriceCalculation(Number(this.bookingForm.value.roomCategory), this.ViewData.daysdiff);
      let total_room_price = calculationResult.total_room_price;
      // Assign the total room price to the 'totalPrice' property
      this.totalPrice = total_room_price;
      //Initialising Data
      let postObj: any = {
        booking_id: this.IsEditRequestedID === "0" ? null : this.EditFromData.booking_id,
        booking_date: new Date(),
        // booking_from: this.bookingForm.value.check_in,
        checkin: new Date(this.bookingForm.value.check_in),
        checkout: new Date(this.bookingForm.value.check_out),
        // booking_till: this.bookingForm.value.check_out,
        room_category_id: this.bookingForm.value.room_category_id,
        booking_mode: this.bookingForm.value.bookingMode,
        total_amount: calculationResult.overallprice,
        room_price: total_room_price,
        paid_amount: 0,
        due_amount: this.bookingForm.value.partialPaymentAmount,
        payment_status: this.bookingForm.value.paymentStatus,
        booking_status:'Arriving',
        upi_id: this.bookingForm.value.upi_id == null ? null : this.bookingForm.value.upi_id.trim() == "" ? null : this.bookingForm.value.upi_id,
        transaction_id:this.bookingForm.value.transaction_id == null ? null : this.bookingForm.value.transaction_id.trim() == "" ? null :this.bookingForm.value.transaction_id,
        guest_id: 0,
        guest_name: this.bookingForm.value.guest_name,
        guest_phone: this.bookingForm.value.guest_phone,
        guest_address: this.bookingForm.value.guest_address,
        guest_email: this.bookingForm.value.guest_email,
        guest_total: Number(this.bookingForm.value.adults) + Number(this.bookingForm.value.childrens),
        adults: this.bookingForm.value.adults,
        childrens: this.bookingForm.value.childrens,
        payment_id:null,
        order_id :null,
        invoice_no :null,
        reference_no :null,
        document_type :this.bookingForm.value.idproof == null ? null : this.bookingForm.value.idproof.trim() == "" ? null : this.bookingForm.value.idproof ,
        document_uniqueid:this.bookingForm.value.idproofvalue == null ? null : this.bookingForm.value.idproofvalue.trim() == "" ? null :this.bookingForm.value.idproofvalue
      };

      if(this.IsEditRequestedID!="0"){
        //New Insert Booking
      this.apiService.postData("Booking/InsertBooking", postObj).subscribe((res: any) => {
        console.log("Response Success !");
        this.isFormSubmittedSuccessfully = true;
        let GeneratedBookingId= res.result; 
        console.log(res.result);
        this.router.navigate(['/admin/details-view', GeneratedBookingId]);
      },
        (error: any) => {
          this.isFormSubmittedSuccessfully = false;
        })
      // Form is valid, proceed with saving data

      }
      else{
        //Edit Exisiting Booking Details
        this.apiService.postData("Booking/EditBookingDetails", postObj).subscribe((res: any) => {
          console.log("Response Success !");
          this.isFormSubmittedSuccessfully = true;
          let GeneratedBookingId= res.result; 
          console.log(res.result);
          this.router.navigate(['/admin/details-view', GeneratedBookingId]);
        },
          (error: any) => {
            this.isFormSubmittedSuccessfully = false;
          })
      }

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
      guest_address: '',
      upi_id: '',
      transaction_id: '',
    });
    this.submitted = false;
    this.showErrorAlert = false;
    this.isFormSubmittedSuccessfully = false;
    this.setValidationPattern();
  }


  closeModal() {
    this.showModal = false;
  }

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

  OverAllPriceCalculation(room_category_id: number, noofdays: number): any {

    let room_price = this.roomCategories.find(x => x.room_category_id === room_category_id)?.room_category_price;
    console.log("Room Price:", room_price);
    this.ViewData.room_price = room_price;
    console.log(this.ViewData.room_price);

    //Total Price
    let total_room_price = room_price * Number(noofdays);
    this.ViewData.total_price = total_room_price;

    //Gst Percentile
    let gst = this.getGSTPercentage(total_room_price);
    this.ViewData.gst_percentile = gst;

    let overallprice = total_room_price * gst;
    console.log(overallprice);
    return {
      overallprice: overallprice,
      total_room_price: total_room_price
    };
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

  getGSTPercentage(price: number) {
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
