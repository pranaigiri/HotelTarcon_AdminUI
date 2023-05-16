import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

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
    this.tableHeader = ["Booking Id","Guest Name","Status","Booking Date","Check-in","Check-out","Booking Mode","Total Guest","Option"];
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
