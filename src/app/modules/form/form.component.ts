import { Component, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CountryISO, SearchCountryField } from "ngx-intl-tel-input";
import { FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';




@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  //for new phone numebr input on checkout
  form: any = {};
  CountryISO = CountryISO; //for initial selected country enum in international telephone list
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.Bhutan, CountryISO.Nepal, CountryISO.Bangladesh];



  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    this.calculateTotalCostWithTax()
    this.details.booking.room_category_id = ""
    this.details.guests.adults = ""
    this.details.guests.childrens = ""
  }

  // Validation for fullname
  bookingdetails: any = {};
  details: any = {
    booking: {},
    guests: {},
    payment: {}
  };

  //ALL ROOM DETAILS
  roomDetails = [
    {
      categoryId: 1,
      categoryName: "Standard",
      amount: 3000
    },
    {
      categoryId: 2,
      categoryName: "Deluxe",
      amount: 4500
    },
    {
      categoryId: 3,
      categoryName: "Hill View",
      amount: 5000
    },
    {
      categoryId: 4,
      categoryName: "Suite",
      amount: 7500
    }

  ]


  // TOTAL PRICE CALCULATING THE TOTAL DAYS
  calculateTotalCostWithTax(): number | null {
    const selectedRoom = this.details.booking.room_category_id;
    const noOfDays = this.totalDays;

    let room = null;
    for (const r of this.roomDetails) {
      if (r.categoryId === Number(selectedRoom)) {
        room = r;
        break;
      }
    }

    if (room) {
      const roomAmount = room.amount;
      const totalAmount = roomAmount * Math.max(noOfDays, 1);

      this.TAX = totalAmount > 7000 ? 0.18 : 0.12;
      this.totalCostWithTax = totalAmount + (totalAmount * this.TAX);
      return this.totalCostWithTax;
    } else {
      this.totalCostWithTax = 0;
      return null;
    }
  }




  // With these console.log statements, you can check the values of selectedRoom, noOfDays, room, this.roomDetails, and ensure they are correctly assigned and matching your expectations. The output in the console will help identify any issues or discrepancies.


  // Assuming categoryId is of type number

  selectedRoom: number | undefined;

  onRoomSelectionChange() {

    if (this.selectedRoom !== undefined) {
      // You can access the selected room using this.selectedRoom
      console.log(this.selectedRoom);
    }

  }

  //DATE RANGE SELECTION LOGIC
  noOfDaysSelected: any;

  tempFromDate: any;
  tempTodate: any;
  tempCheckoutDate: any;


  //TAXES & CHARGES
  TAX: number = 0.12;
  totalDays: any;
  totalCostWithTax: number = 0;


  calculateTotalDays() {
    if (this.details.booking.booking_from && this.details.booking.booking_from) {
      const from = new Date(this.details.booking.booking_date);
      const to = new Date(this.details.booking.booking_from)
      const timeDiff = Math.abs(to.getTime() - from.getTime())
      this.totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
    } else {
      this.totalDays = 0;
    }
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const day = ("0" + currentDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }



  postBookingData() {

    const postObj: any = {
      booking: {
        booking_id: "",
        booking_date: this.details.booking.booking_date,
        booking_from: this.details.booking.booking_from,
        booking_till: this.details.booking_till,
        room_category_id: this.details.booking.room_category_id,
        booking_mode: "offline",
        booking_status: ""
      },
      payment: {
        payment_id: "",
        booking_id: "",
        invoice_no: "",
        reference_no: "",
        transaction_id: "",
        total_amount: this.calculateTotalCostWithTax(),
        paid_amount: 0,
        due_amount: 0,
        payment_status: "",
        upi_id: ""
      },
      guests: {
        guest_id: 0,
        booking_id: "",
        guest_name: this.details.guests.guest_name,
        guest_phone: this.details.guests.guest_phone,
        guest_address: "",
        guest_email: this.details.guests.guest_email,
        guest_total: 0,
        adults: this.details.guests.adults,
        childrens: this.details.guests.childrens
      }
    };
    this.apiService.postData("Booking/NewBooking", postObj).subscribe((res: any) => {
      console.log(res, 'RESPONSE NEW BOOKING');
    });
  }


  onContactInfoSubmit() {

  }

  onReset() {

  }
}
