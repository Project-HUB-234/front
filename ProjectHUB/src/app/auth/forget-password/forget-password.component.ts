import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {

constructor(private authService: AuthService, private router: Router) {
  
}
  email: string = '';
  submit() {
   this.authService.forgetPassword(this.email).subscribe( {
   
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Password updated successfully please check your email',
        timer: 2000,
        showConfirmButton: true,
      });
      this.router.navigate(['/security/login']);
    },
    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to update password',
        confirmButtonColor: '#d33',
      });
    },
    
  }
);
  }
}
