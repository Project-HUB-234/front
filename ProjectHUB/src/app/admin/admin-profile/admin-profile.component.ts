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



  profilePreview: string | ArrayBuffer | null = null;
backgroundPreview: string | ArrayBuffer | null = null;
qrCodePreview: string | ArrayBuffer | null = null;

passwordData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
};

onProfileFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => this.profilePreview = reader.result;
    reader.readAsDataURL(file);
  }
}

onBackgroundFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => this.backgroundPreview = reader.result;
    reader.readAsDataURL(file);
  }
}

onQRCodeFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => this.qrCodePreview = reader.result;
    reader.readAsDataURL(file);
  }
}

changePassword(form: any) {
  if (form.valid) {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }

    // Call API here with passwordData
    console.log('Change password data', this.passwordData);
  }
}

}
