import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-details-view',
  templateUrl: './details-view.component.html',
  styleUrls: ['./details-view.component.scss']
})
export class DetailsViewComponent implements OnInit {

  bookingData: any;
  roomDetails:any={};
  roomCategories:any=[];
  roomCategoryID:any;
  bookingId:any;
  showTooltip:boolean =false;
  gstPercentile:number=0;
  gspApplicable:number=0;
  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.bookingId = this.route.snapshot.paramMap.get('id')?.toString();
    this.GetBookingByBookingId(this.bookingId);
    
  }

  GetBookingByBookingId(bookingId: string) {
    this.apiService.getDataById("Booking/GetBookingBySearchParam", bookingId).subscribe((res: any) => {
      if (res.result) {
        this.bookingData = res.result;
        this.roomCategoryID = this.bookingData.room_category_id;
        this.GetRoomDetails();
        // this.GetApplicableGST(this.bookingData.room_price)
        this.GetApplicableGST(50000)
      }
      else {
        this.router.navigate(["admin/dashboard"]);
      }
    })
  }

  GetRoomDetails(){
    this.apiService.getData("Common/GetAllRoomCategories").subscribe((res: any) => {
      console.log("Response Success GetAllRoomCategories!");
      this.roomCategories = res.result;
      // this.roomCategoryID=2;
      // alert(this.roomCategoryID);
      this.roomDetails = this.roomCategories.find((category: any) => category.room_category_id === this.roomCategoryID)
    });
  }

  GetApplicableGST(total_room_price:number): any {
    this.gstPercentile = this.getGSTPercentage(total_room_price);
    this.gspApplicable = (this.gstPercentile/100) * this.bookingData.room_price;
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
