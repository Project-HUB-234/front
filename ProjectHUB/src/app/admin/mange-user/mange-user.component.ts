import { Component, TemplateRef, ViewChild, } from '@angular/core';
import { MatDialog,MatDialogRef  } from '@angular/material/dialog';
import { AdminService } from 'src/app/services/admin.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mange-user',
  templateUrl: './mange-user.component.html',
  styleUrls: ['./mange-user.component.css']
})
export class MangeUserComponent {

  dialogRef!: MatDialogRef<any>;
  ngOnInit(): void {
  this.getAllUsers();
  }
  constructor(private adminService:AdminService , public dialog: MatDialog) {}

  @ViewChild('callEditUserDialog') EditUserDialog !: TemplateRef<any>;
  @ViewChild('callDeleteUserDialog') DeleteUserDialog!: TemplateRef<any>
  users: any[] = [];
  getAllUsers(){
    this.adminService.getAllUsers().subscribe((res:any)=>{
      this.users = res;
      console.log(this.users);
    })
  }

  searchTerm: string = '';

  filteredUsers(): any[] {
    if (!this.searchTerm.trim()) {
      return this.users;
    }
    const term = this.searchTerm.toLowerCase();
    return this.users.filter(
      (u) =>
        u.FirstName.toLowerCase().includes(term) ||
        u.LastName.toLowerCase().includes(term) ||
        u.Email.toLowerCase().includes(term)
    );
  }
  selectedUser: any = {} as any;
  EditUserForm: FormGroup = new FormGroup({
    UserId: new FormControl(''),
    FirstName: new FormControl(''),
    LastName: new FormControl(''),
    Email: new FormControl(''),
    PhoneNumber: new FormControl(''),
    Job: new FormControl(''),
    Brif: new FormControl(''),
    Address: new FormControl(''),
    ProfilePicture: new FormControl(''),
    BackgroundPicture: new FormControl(''),
    QuickAccessQrcode: new FormControl('')  
  });
  profilePreview: File | null = null;
  backgroundPreview: File | null = null;
  qrCodePreview  :File | null = null;

  qrCodePreviewUrl: string | null = null;
  profilePreviewUrl: string | null = null;
  backgroundPreviewUrl: string | null = null;

  onFileChange(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
  
    const file = input.files[0];
    const reader = new FileReader();
  
    reader.onload = () => {
      const result = reader.result as string;
  
      this.EditUserForm.patchValue({ [controlName]: result });
  
      if (controlName === 'ProfilePicture') {
        this.profilePreview = file;
        this.profilePreviewUrl = result;
      } else if (controlName === 'BackgroundPicture') {
        this.backgroundPreview = file;
        this.backgroundPreviewUrl = result;
      } else if (controlName === 'QuickAccessQrcode') {
        this.qrCodePreview = file;
        this.qrCodePreviewUrl = result;
      }
    };
  
    reader.readAsDataURL(file);
  }
  
  openEditUserDialog(user: any) {
    this.EditUserForm.reset();
    this.selectedUser = user;
     this.dialog.open(this.EditUserDialog);
  }
  confirmEditeUser() {
    this.EditUserForm.value.ProfilePicture = this.profilePreview;
    this.EditUserForm.value.BackgroundPicture = this.backgroundPreview;
    this.EditUserForm.value.QuickAccessQrcode = this.qrCodePreview;
  
    this.adminService.updateUser(this.EditUserForm.value).subscribe({
      next: (res: any) => {
        this.dialog.closeAll();
        Swal.fire({
          icon: 'success',
          title: 'User Updated',
          text: 'The user has been updated successfully.',
          confirmButtonColor: '#3085d6'
        });     
           this.getAllUsers();

      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'An error occurred while updating the user.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }
  
  selectedUserId: number = 0;
  openDeleteUserDialog(userId: number) {
    this.selectedUserId = userId;
    this.dialog.open(this.DeleteUserDialog);
  }
  confirmDeleteUser(){
    this.adminService.deleteUser(this.selectedUserId).subscribe({
      next: (res: any) => {
        this.dialog.closeAll();
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The user has been deleted.',
          confirmButtonColor: '#3085d6'
        });     
           this.getAllUsers();

      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: 'An error occurred while deleting the user.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }
}
