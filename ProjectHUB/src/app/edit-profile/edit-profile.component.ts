import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  
  user = {
    Email: 'user@example.com',
    FirstName: 'John',
    LastName: 'Doe',
    ProfilePicture: '',
    PhoneNumber: '',
    Brif: '',
    DateJoined: new Date('2023-01-01'),
    QuickAccessQrcode: '',
    BackgroundPicture: '',
    Address: '',
    Job: '',
  };

  passwords = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  onProfilePicSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Preview image (optional)
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.ProfilePicture = e.target.result;
      };
      reader.readAsDataURL(file);
      // Upload logic can be added here
    }
  }

  onBackgroundPicSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.BackgroundPicture = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmitProfile() {
    console.log('Profile saved', this.user);
    // Call your API to save profile info here
  }

  onSubmitPassword() {
    if (this.passwords.newPassword !== this.passwords.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    console.log('Change password request:', this.passwords);
    // Call your API to change password here
  }
}
