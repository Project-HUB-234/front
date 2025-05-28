import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private homeService: HomeService, private adminService: AdminService) {}
  roleId: number | null = null;
  categoryCount: number = 0;
  totalContacts = 0;
  totalPosts = 0;
  totalUser = 0;
  userPosts: any = null ;
  contacts: any[] = [];
filteredContacts: any[] = [];
  ngOnInit(): void {
    this.roleId = Number(localStorage.getItem('roleId'));
    if (this.roleId === 1) {
      this.categoiesCount();
      this.ContactCount();
      this.postCount();
      this.userCount();
      this.getAllPosts();
      this.loadContacts();
    }
  }

  categoiesCount() {
    this.homeService.categoriesCount().subscribe((result) => {
      if (result) {
        this.categoryCount = Number(result);
      }
    });
  }
  ContactCount() {
    this.homeService.categoriesCount().subscribe((result) => {
      if (result) {
        this.totalContacts = Number(result);
      }
    });
  }
  postCount() {
    this.homeService.postCount().subscribe((result) => {
      if (result) {
        this.totalPosts = Number(result);
      }
    });
  }
  userCount() {
    this.homeService.userCount().subscribe((result) => {
      if (result) {
        this.totalUser = Number(result);
      }
    });
  }

  getAllPosts(): void {
      
    this.homeService.getAllPosts().subscribe(
      (result: any) => {

        if (result) {
          this.userPosts = result.slice(0, 5)
        }
      }
    );
  }

  loadContacts() {
    this.adminService.getContact().subscribe((data: any[]) => {
      this.contacts = data;
      this.filteredContacts = [...data];
      console.log(this.contacts);
    });
  }
}
