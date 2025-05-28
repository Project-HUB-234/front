import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { error } from 'jquery';
import { HomeService } from '../services/home.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  constructor(private authService: AuthService, private homeService: HomeService, private toastr: ToastrService) {}
  userId: number | undefined;
  ngOnInit() {
    this.userId = Number(localStorage.getItem('userId'));
    if(this.userId){
      this.getUserData();
    }
  }

    currentPassword= ''
    newPassword= ''
    confirmPassword= ''
    userProfile: any = null;
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

  onSubmitProfile() {
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

  onSubmitPassword() {

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