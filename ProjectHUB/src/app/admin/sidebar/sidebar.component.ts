import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(private router: Router) {}

  toggleSidebar() {
    const sidebar = document.getElementById('main-wrapper');
    sidebar?.classList.toggle('show-sidebar');
  }
  

  logout() {
    localStorage.clear();
    this.router.navigate(['/security/login']);
  }
}
