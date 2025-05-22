import { Component, AfterViewInit } from '@angular/core';
import { FormGroup ,FormControl, Validators,AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import * as $ from 'jquery';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  implements AfterViewInit {
 constructor(private authService : AuthService, private router :Router, private toastr : ToastrService ) {}
  ngAfterViewInit(): void {
     if ($('#myElement').length) {
  $('#myElement').fadeIn();
}
  }

    registerForm : FormGroup = new FormGroup({
    FirstName : new FormControl('',[Validators.required]),
    LastName : new FormControl('',[Validators.required]),
    Email : new FormControl('',[Validators.required, Validators.email]),
    HashedPassword : new FormControl('',[Validators.required, Validators.minLength(8),Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_-]).*$/)]),
    ConfirmPassword: new FormControl('', [Validators.required]) },
     { validators: this.passwordMatchValidator });
  
    passwordVisible: boolean = false;
confirmPasswordVisible: boolean = false;

  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('HashedPassword')?.value;
    const confirmPassword = form.get('ConfirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  showSuccess() {
    this.toastr.success('Wellcome =)', 'Success');
  }
togglePasswordVisibility() {
  this.passwordVisible = !this.passwordVisible;
}

toggleConfirmPasswordVisibility() {
  this.confirmPasswordVisible = !this.confirmPasswordVisible;
}

 submit() {
  if (this.registerForm.valid) {
    this.authService.register(this.registerForm.value).subscribe(
      (result: any) => {
        if (result && result.message) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: result.message,
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/security/login']);
          });
        }
      },
      error => {
        const errorMessage = error.error?.message || 'Registration failed';
        
        // Customize message if already registered
        if (errorMessage.toLowerCase().includes('already registered')) {
          Swal.fire({
            icon: 'warning',
            title: 'Already Registered',
            text: errorMessage,
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonText: 'OK'
          });
        }
      }
    );
  } else {
    this.registerForm.markAllAsTouched();
  }
}

}
