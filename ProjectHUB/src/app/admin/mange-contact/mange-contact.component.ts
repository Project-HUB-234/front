import { Component, TemplateRef, ViewChild, } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mange-contact',
  templateUrl: './mange-contact.component.html',
  styleUrls: ['./mange-contact.component.css']
})
export class MangeContactComponent {
  dialogRef!: MatDialogRef<any>;

  constructor(public dialog: MatDialog, private adminService: AdminService) {}
  @ViewChild('callDeleteContactDialog') DeleteContactDialog!: TemplateRef<any>

  contacts: any[] = [];
filteredContacts: any[] = [];
searchTerm: string = '';

selectedContactId: number | null = null;
selectedContactIndex: number | null = null;
  

ngOnInit() {
  this.loadContacts();
}

loadContacts() {
  this.adminService.getContact().subscribe((data: any[]) => {
    this.contacts = data;
    this.filteredContacts = [...data];
    console.log(this.contacts);
  });
}
  
filterContacts() {
  const term = this.searchTerm.toLowerCase();
  this.filteredContacts = this.contacts.filter(
    c =>
      c.userEmail.toLowerCase().includes(term) ||
      c.contactTitle.toLowerCase().includes(term)
  );
}

  generateMailToLink(contact: any): string {
    const subject = encodeURIComponent(`Re: ${contact.ContactTitle}`);
    const body = encodeURIComponent(`Hi,\n\nRegarding your message:\n\n${contact.ContactMessage}`);
    return `mailto:${contact.UserEmail}?subject=${subject}&body=${body}`;
  }
  
  openDeleteContactDialog(contactId: number, index: number) {
    this.selectedContactId = contactId;
    this.selectedContactIndex = index;
  
    Swal.fire({
      title: 'Are you sure?',
      text: 'This contact will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.confirmDeleteContact();
      }
    });
  }
  
  confirmDeleteContact() {
    if (this.selectedContactId !== null && this.selectedContactIndex !== null) {
      this.adminService.deleteContact(this.selectedContactId).subscribe({
        next: () => {
          this.contacts.splice(this.selectedContactIndex as number, 1);
          this.filterContacts(); // refresh filtered list
  
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The contact has been deleted.',
            timer: 2000,
            showConfirmButton: false
          });
  
          this.selectedContactId = null;
          this.selectedContactIndex = null;
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete the contact.'
          });
        }
      });
    }
  }
  
}