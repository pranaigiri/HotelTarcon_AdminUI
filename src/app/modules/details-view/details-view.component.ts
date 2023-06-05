import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-details-view',
  templateUrl: './details-view.component.html',
  styleUrls: ['./details-view.component.scss']
})
export class DetailsViewComponent implements OnInit {

  bookingData: any;
  // roomCategories: any[] = [
  //   { room_category_id: 1, room_category_name: 'Standard Room', room_category_price: 0 },
  //   { room_category_id: 2, room_category_name: 'Deluxe Room', room_category_price: 0 },
  //   { room_category_id: 4, room_category_name: 'Hill View Room', room_category_price: 0 },
  //   { room_category_id: 3, room_category_name: 'Suite', room_category_price: 0 }
  // ];

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('id');

    this.GetBookingByBookingId(bookingId);
  }
  async GetBookingByBookingId(bookingId: string | null): Promise<void> {
    this.bookingData = {};

    if (bookingId) {
      try {
        const res = await this.apiService.getDataById("Booking/GetBookingBySearchParam", bookingId).toPromise();
        console.log(res,"Details: Fetched Successfully!");
        this.bookingData = res.result.data;
        console.log(this.bookingData);
        this.apiService.getData("Common/GetAllRoomCategories").subscribe((res: any) => {
          console.log("Response Success GetAllRoomCategories!");
          const roomCategories = res.result;
        
          // Update the bookingData object with roomCategories
          this.bookingData.roomCategories = roomCategories;
        
          // Populate the room_category_name property
          const roomCategoryId = this.bookingData.booking?.room_category_id;
          const selectedCategory = roomCategories.find((category:any) => category.room_category_id === roomCategoryId);
          this.bookingData.booking.room_category_name = selectedCategory ? selectedCategory.room_category_name : '';
        });
        
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    }
  }

  roomCategories: { [key: number]: string } = {};
  // GetAllRoomCategories() {
  //   this.apiService.getData("Common/GetAllRoomCategories").subscribe((res: any) => {
  //     console.log("Response Success GetAllRoomCategories!");
  //     this.roomCategories = {};
  
  //     for (const category of res.result) {
  //       this.roomCategories[category.room_category_id] = category.room_category_name;
        
  //     }
  //   });
  // }

}
