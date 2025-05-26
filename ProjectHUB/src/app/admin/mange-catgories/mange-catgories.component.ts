import { Component, TemplateRef, ViewChild, } from '@angular/core';
import { MatDialog,MatDialogRef  } from '@angular/material/dialog';

@Component({
  selector: 'app-mange-catgories',
  templateUrl: './mange-catgories.component.html',
  styleUrls: ['./mange-catgories.component.css']
})
export class MangeCatgoriesComponent {
  dialogRef!: MatDialogRef<any>;

  constructor(public dialog: MatDialog) {}
  @ViewChild('callDeletecategoryDialog') DeletecategoryDialog!: TemplateRef<any>

  categories: any[] = [
    { CategoryName: 'Technology' },
    { CategoryName: 'Travel' },
    { CategoryName: 'Food' },
  ];

  newCategory: any = { CategoryName: '' };
  editIndex: number | null = null;

  onAddCategory(form: any) {
    if (form.valid && this.newCategory.CategoryName.trim()) {
      this.categories.push({ CategoryName: this.newCategory.CategoryName.trim() });
      this.newCategory.CategoryName = '';
      form.resetForm();
    }
  }

  startEdit(index: number) {
    this.editIndex = index;
  }

  cancelEdit() {
    this.editIndex = null;
  }

  onSaveEdit(index: number, form: any) {
    if (form.valid && this.categories[index].CategoryName.trim()) {
      this.categories[index].CategoryName = this.categories[index].CategoryName.trim();
      this.editIndex = null;
    }
  }

  onDeleteCategory(index: number) {
    this.dialog.open(this.DeletecategoryDialog);

  }
  confirmDeleteCategory() {
  }
}
