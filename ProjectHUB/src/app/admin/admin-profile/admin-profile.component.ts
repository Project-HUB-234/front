import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { HomeService } from 'src/app/services/home.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {

  constructor(private authService : AuthService, private homeService: HomeService, private toastr: ToastrService) {
    
  }
  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    this.getUserData();
  }

  onSaveEdit(form: NgForm) {
    if (form.valid) {

      const data = {
        userId:this.userProfile.userId,
        email:this.userProfile.email,
        firstName:this.userProfile.firstName,
        lastName:this.userProfile.lastName,
        phoneNumber:this.userProfile.phoneNumber,
        brif:this.userProfile.brif,
        address:this.userProfile.address,
        profilePicture:this.Profile,
        quickAccessQrcode:this.QR,
        backgroundPicture:this.background,
        job:this.userProfile.job,
      };
      this.homeService.updateProfile(data).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Personal data updated successfully',
            timer: 2000,
            showConfirmButton: false,
          });
          this.getUserData();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to update user data',
            confirmButtonColor: '#d33',
          });
        },
      });
  

    }
  }



  profilePreview: string | ArrayBuffer | null = null;
backgroundPreview: string | ArrayBuffer | null = null;
qrCodePreview: string | ArrayBuffer | null = null;


  currentPassword= ''
  newPassword= ''
  confirmPassword= ''
  userId: number | undefined;
  userProfile: any = null;


  background : File | null =null;
  QR : File | null =null;
  Profile : File | null =null;

onProfilePicSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    // Preview image (optional)
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.Profile =file
      this.userProfile.profilePicture = e.target.result;
    };
    reader.readAsDataURL(file);
    // Upload logic can be added here
  }
}

onBackgroundPicSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.background=file
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.userProfile.backgroundPicture = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
onQRPicSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.QR=file
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.userProfile.quickAccessQrcode = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

getUserData() {
  this.homeService.getUserData(this.userId!).subscribe(
    (result: any) => {
      if (result) {
        this.userProfile = result;
        console.log(this.userProfile);
      }
    },
    (error) => {
      this.toastr.error('Something went wrong. Please try again.');
    }
  );
}


changePassword(form: any) {
  if (form.valid) {
    if (this.newPassword !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'New password and confirm password do not match',
        confirmButtonColor: '#d33',
      });
      return;
    }
    const password = {
      oldPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
      userId: this.userId
    }
      this.authService.changePassword(password).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Password changed successfully',
            timer: 2000,
            showConfirmButton: false,
          });
        
          this.currentPassword=''
          this.newPassword= ''
          this.confirmPassword= ''

        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to change password',
            confirmButtonColor: '#d33',
          });
        },
      });
  }
}

}
