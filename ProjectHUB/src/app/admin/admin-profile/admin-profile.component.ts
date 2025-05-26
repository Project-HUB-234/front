import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent {
  admin = {
    FirstName: 'admin',
    LastName: 'admin',
    Email: 'admin@gmail.com',
    PhoneNumber: '0123456789',
    ProfilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    BackgroundPicture: 'https://images.unsplash.com/photo-1557683316-973673baf926',
    Brif: 'admin',
    DateJoined: new Date(),
    QuickAccessQrcode: 'https://api.qrserver.com/v1/create-qr-code/?data=admin',
    Address: 'admin',
    Job: 'admin'
  };

  onSaveEdit(form: NgForm) {
    if (form.valid) {
      // Save logic here (e.g. API call)
      console.log('Profile updated:', this.admin);
    }
  }

  cancelEdit() {
    // Reload or reset logic
    console.log('Edit canceled');
  }
}
