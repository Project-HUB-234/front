import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  recentActivities = [
    { timestamp: new Date(), description: 'User JohnDoe created a new post.' },
    { timestamp: new Date(new Date().setDate(new Date().getDate() - 1)), description: 'Category "Technology" updated.' },
    { timestamp: new Date(new Date().setDate(new Date().getDate() - 2)), description: 'Admin JaneSmith logged in.' },
  ];

  totalCategories = 12; // Replace with your real data
  totalContacts = 34;
  totalPosts = 58;
  totalAdmins = 3;

  recentContacts = [
    { name: 'Alice Johnson', email: 'alice@example.com', phone: '123-456-7890', dateAdded: new Date('2025-05-20') },
    { name: 'Bob Smith', email: 'bob@example.com', phone: '987-654-3210', dateAdded: new Date('2025-05-18') },
    { name: 'Charlie Brown', email: 'charlie@example.com', phone: '555-666-7777', dateAdded: new Date('2025-05-17') },
    { name: 'Diana Prince', email: 'diana@example.com', phone: '222-333-4444', dateAdded: new Date('2025-05-16') },
    { name: 'Evan Stone', email: 'evan@example.com', phone: '111-222-3333', dateAdded: new Date('2025-05-15') },
  ];
}
