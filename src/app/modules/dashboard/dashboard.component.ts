import { Component, OnInit } from '@angular/core';
import { error } from 'console';
import { ApiService } from 'src/app/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  //  table headers
  tableHeader :any=[];
  // table data
  bookingsData: any = []


  constructor(private apiService:ApiService) {
    this.tableHeader = [  { title: "Booking Id" },  { title: "Guest Name" },  { title: "Status" },  { title: "Booking Date" },  { title: "Check-in" },  { title: "Check-out" }, {title: "Booking Mode"}, { title: "Total Guest" }, { title: "Option" }];
    this.GetAllBookings();
   }


  ngOnInit() {
  }

  GetAllBookings(){
    this.apiService.getData("Booking/GetAllBookings").subscribe((res:any)=>{
      this.bookingsData = res.result.data
      console.log(this.bookingsData)
    })
  }





}
