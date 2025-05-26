import { Component, TemplateRef, ViewChild, } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mange-contact',
  templateUrl: './mange-contact.component.html',
  styleUrls: ['./mange-contact.component.css']
})
export class MangeContactComponent {
  dialogRef!: MatDialogRef<any>;

  constructor(public dialog: MatDialog) {}
  @ViewChild('callDeleteContactDialog') DeleteContactDialog!: TemplateRef<any>

  searchTerm: string = '';
  filteredContacts: any[] = [];
  
  contacts: any[] = [
    {
      UserEmail: 'john.doe@example.com',
      ContactTitle: 'Website Issue',
      ContactMessage: 'I am experiencing an issue with the login feature on your website.',
    },
    {
      UserEmail: 'jane.smith@example.com',
      ContactTitle: 'Feature Request',
      ContactMessage: 'Could you please add a dark mode to the website?',
    },
    {
      UserEmail: 'alex.brown@example.com',
      ContactTitle: 'General Inquiry',
      ContactMessage: 'What are your customer support hours?',
    },
    {
      UserEmail: 'maria.wilson@example.com',
      ContactTitle: 'Feedback',
      ContactMessage: 'Great service! I love the new updates you rolled out last week.',
    },
    {
      UserEmail: 'samuel.jones@example.com',
      ContactTitle: 'Bug Report',
      ContactMessage: 'The contact form sometimes fails to submit on mobile devices.',
    }
  ];
  ngOnInit() {
    // Initialize filteredContacts with full list initially
    this.filteredContacts = [...this.contacts];
  }
  
  filterContacts() {
    const term = this.searchTerm.toLowerCase();
    this.filteredContacts = this.contacts.filter(
      c =>
        c.UserEmail.toLowerCase().includes(term) ||
        c.ContactTitle.toLowerCase().includes(term)
    );
  }
  generateMailToLink(contact: any): string {
    const subject = encodeURIComponent(`Re: ${contact.ContactTitle}`);
    const body = encodeURIComponent(`Hi,\n\nRegarding your message:\n\n${contact.ContactMessage}`);
    return `mailto:${contact.UserEmail}?subject=${subject}&body=${body}`;
  }
  
  openDeleteContactDialog(contact: any) {
    this.dialog.open(this.DeleteContactDialog);
  }
  confirmDeleteContact() { 
  
}
}