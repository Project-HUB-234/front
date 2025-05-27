import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private router: Router, private homeService: HomeService) {}

  userId: number = 0;
  userProfile: any;

  ngOnInit(): void {
    this.userId = parseInt(localStorage.getItem('userId') || '0');
    if(this.userId){
      this.getUserData();  
  }
  }
  getUserData(){
    this.homeService.getUserData(this.userId!).subscribe(
      (result: any) => {
        this.userProfile = result;
      }
    );
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/security/login']);
  }
}
