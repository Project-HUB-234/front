import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HomeService } from '../services/home.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm = this.fb.group({
    UserEmail: ['', [Validators.required, Validators.email]],
    ContactTitle: [''],
    ContactMessage: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private homeService: HomeService) {}

  onSubmit(): void {
    if (this.contactForm.valid) {
      const contactData = this.contactForm.value;
  
      this.homeService.addContact(contactData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Message Sent!',
            text: 'Your contact message has been successfully submitted.',
            timer: 2000,
            showConfirmButton: false
          });
  
          this.contactForm.reset();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: 'There was a problem sending your message. Please try again later.'
          });
        }
      });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
  
}
