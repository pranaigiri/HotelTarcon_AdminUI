import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from 'src/app/helpers/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isSidebarHidden: boolean = false;
  isMobile: boolean = false;
  enableSidebarOverlay: boolean = false;
  logoUrl: string = "https://tarconsikkim.in/assets/tarcon_logo.png";

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any): void {
    this.toggleSidebarVisibility(event.target.innerWidth);
  }

  toggleSidebarVisibility(windowWidth: number): void {
    // Adjust the breakpoint value according to your needs
    const breakpoint = 1024;

    if (windowWidth < breakpoint) {
      this.isSidebarHidden = true;
      this.isMobile = true;
    } else {
      this.isSidebarHidden = false;
      this.isMobile = false;
    }
  }
  constructor(private authService:AuthService) { }

  ngOnInit() {
  }

  toggleSidebar(): void {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  logout(){
    this.authService.logout();
  }

}
