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
  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.bookingId = this.route.snapshot.paramMap.get('id')?.toString();
    this.GetBookingByBookingId(this.bookingId);
    this.GetRoomDetails();
  }

  GetBookingByBookingId(bookingId: string) {
    this.apiService.getDataById("Booking/GetBookingBySearchParam", bookingId).subscribe((res: any) => {
      if (res.result.data) {
        this.bookingData = res.result.data;
        this.roomCategoryID = this.bookingData.booking.room_category_id;
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
      this.roomCategoryID=1;
      this.roomDetails = this.roomCategories.find((category: any) => category.room_category_id === this.roomCategoryID)
    });
  }

  

}
