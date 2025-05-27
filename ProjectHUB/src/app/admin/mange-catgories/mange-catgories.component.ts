import { Component, TemplateRef, ViewChild, } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-mange-catgories',
  templateUrl: './mange-catgories.component.html',
  styleUrls: ['./mange-catgories.component.css']
})
export class MangeCatgoriesComponent {
  constructor( private adminService: AdminService) {}


  ngOnInit(): void {
    this.getCategories();
  }
  
  categories: any[] = [];
  getCategories(){
    this.adminService.getPostCategories().subscribe(
      (result: any) => {
        this.categories = result;
        console.log(this.categories);
      }
    );
  }
  
  newCategory: any = { CategoryName: '' };
  editIndex: number | null = null;

  onAddCategory(form: any) {
    const name = this.newCategory.CategoryName?.trim();
  
    if (form.valid && name) {
      const newCat = { CategoryName: name };
  
      this.adminService.addPostCategory(newCat).subscribe({
        next: (createdCategory: any = {}) => {
          this.categories.push(createdCategory);
          this.newCategory.CategoryName = '';
          form.resetForm();
  
          Swal.fire({
            icon: 'success',
            title: 'Category Added',
            text: 'The new category was added successfully.',
            timer: 2000,
            showConfirmButton: false
          });
          this.getCategories();
        },
        error: (err) => {
          console.error('Error adding category:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add category. Please try again later.',
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Please enter a valid category name.',
      });
    }
  }
  

  startEdit(index: number) {
    this.editIndex = index;
  }

  cancelEdit() {
    this.editIndex = null;
  }

  onSaveEdit(index: number, form: any) {
    const editedCategory = this.categories[index];
  
    if (form.valid && editedCategory.categoryName.trim()) {
      const updateDto = {
        id: editedCategory.categoryId,
        categoryName: editedCategory.categoryName.trim()
      };
  
      this.adminService.updateCategory(updateDto).subscribe({
        next: () => {
          this.categories[index].categoryName = updateDto.categoryName;
  
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'The category has been updated.',
            timer: 2000,
            showConfirmButton: false
          });
  
          this.editIndex = null;
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update the category.'
          });
        }
      });
    }
  }
  
 

  confirmDeleteCategory(categoryId: number, index: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This category will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.adminService.deleteCategory(categoryId ).subscribe({
          next: () => {
            this.categories.splice(index, 1);
  
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'The category has been deleted.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete the category.'
            });
          }
        });
      }
    });
  }
  
}
