import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
 constructor(private authService : AuthService, private router : Router,) {
  }
  loginForm : FormGroup = new FormGroup({
    UserName : new FormControl('',[Validators.required, Validators.email]),
    PasswordHash : new FormControl('',[Validators.required]),
  });
  passwordVisible :boolean =false;

  togglePasswordVisibility(){
    this.passwordVisible =!this.passwordVisible
  }
  login(){
    if(this.loginForm.valid){
      localStorage.clear();
      this.authService.login(this.loginForm.value).subscribe((result:any)=>{
       if(result){
console.log('Login result:', result);
     Swal.fire({
            icon: 'success',
            title: 'Welcome!',
            text: 'Login successful',
            confirmButtonText: 'Continue'
          }).then(() => {
  localStorage.setItem('userId', result.userId);
  localStorage.setItem('roleId', result.roleId);

  if (result.roleId === 1) {
    this.router.navigate(['/admin/dashboard']);
  } else if (result.roleId === 2) {
    this.router.navigate(['/profile']);
  }
});
       }
      },err=>{
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error.message,
            confirmButtonText: 'OK'
          });
      });
    }
    else{
      this.loginForm.markAllAsTouched()
    }
  }
}
