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
  bookingsData: any = [];
  keyMetrics:any={
    guesttotalsum:0,bookingcount:0,sum_totalamount:0
  }


  constructor(private apiService:ApiService) {
    this.tableHeader = ["Booking Id","Guest Name","Status","Booking Date","Check-in","Check-out","Booking Mode","Total Guest","Option"];
    this.GetAllBookings();
    this.GetKeyMetrics();
   }


  ngOnInit() {
  }

  GetAllBookings(){
    this.apiService.getData("Booking/GetAllBookings").subscribe((res:any)=>{
      this.bookingsData = res.result.data
      console.log(this.bookingsData)
    })
  }


  GetKeyMetrics(){
    this.apiService.getData("Booking/getkeymetrics").subscribe((res:any)=>{
      this.keyMetrics.bookingcount = res.result.bookingcount==null?0:res.result.bookingcount;
      this.keyMetrics.guesttotalsum = res.result.guesttotalsum==null?0:res.result.guesttotalsum;
      this.keyMetrics.sum_totalamount = res.result.sum_totalamount==null?0:res.result.sum_totalamount
    })
  }





}
