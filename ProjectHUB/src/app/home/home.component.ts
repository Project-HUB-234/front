import { Component } from '@angular/core';
declare var bootstrap: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
 selectedImage: string | null = null;
  postedPhotos: string[] = [];
  private modal: any;

  constructor() {}

  ngAfterViewInit() {
    this.modal = new bootstrap.Modal(document.getElementById('photoUploadModal'));
  }

  openPhotoUpload() {
    this.modal.show();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  postPhoto() {
    if (this.selectedImage) {
      this.postedPhotos.unshift(this.selectedImage);
      this.selectedImage = null;
      this.modal.hide();
    }
  }
}
