import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(private router: Router, private adminService: AdminService) {}
  userId: number = 0;
  userProfile: any;

  ngOnInit(): void {
    this.userId = parseInt(localStorage.getItem('userId') || '0');
    if(this.userId){
      this.getUserData();  
  }
  }
  getUserData(){
    this.adminService.getUserData(this.userId!).subscribe(
      (result: any) => {
        this.userProfile = result;
      }
    );
  }
  toggleSidebar() {
    const sidebar = document.getElementById('main-wrapper');
    sidebar?.classList.toggle('show-sidebar');
  }
  

  logout() {
    localStorage.clear();
    this.router.navigate(['/security/login']);
  }
}
