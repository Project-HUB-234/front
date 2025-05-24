import { Component, ElementRef, OnInit, TemplateRef, ViewChild,HostListener   } from '@angular/core';
import { HomeService } from '../services/home.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { TimeagoModule } from 'ngx-timeago';

declare var bootstrap: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
 
  private modal: any;

  constructor(private homeService : HomeService , private toastr:ToastrService) {}

  ngAfterViewInit() {
    this.modal = new bootstrap.Modal(document.getElementById('photoUploadModal'));


  }


 userId : number|undefined ;
 ngOnInit(): void {
    this.userId = Number(localStorage.getItem("userId"));
     console.log(this.userId);
    if(this.userId){
     this.getUserData()
      this.getUserPosts() 
      this.getPostCategories();
    } 
  }

userProfile: any = null;
  getUserData(){
    this.homeService.getUserData(this.userId!).subscribe((result:any)=>{
      if(result){
        this.userProfile= result;
        console.log(this.userProfile);
      }
    },error=>{
      this.toastr.error("Something went wrong. Please try again.")
    })
  }

postCategories: any[] = [];
selectedCategory: any = null;
onCategoryChange(value: any) {
  console.log('Selected category:', value);
  this.selectedCategory = value; 
}

    getPostCategories(){
    this.homeService.getPostCategories().subscribe((result:any)=>{
      if(result){
        this.postCategories=result;
        console.log(this.postCategories);
      }
    },error=>{
      this.toastr.error("Failed to get categories")

    })
  }

     userPosts: any = null ;
     postsCount: number=0;

    getUserPosts(): void {
    this.homeService.getUserPosts(this.userId!).subscribe(
      (result: any) => {

        if (result) {
          this.userPosts = result.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          this.postsCount = result.userPosts;
        }
        console.log("ffff",this.userPosts);
      },
      (error) => {
        this.toastr.error('Failed to load posts. Please refresh.');
      }
    );
  }

selectedImageFile: File | null = null;
postedPhotos: string[] = [];
postContent: string = '';


 onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedImageFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.postedPhotos = [reader.result as string]; 
    };
    reader.readAsDataURL(file);
  }
}

postPhoto() {
  const post = {
    content: this.postContent,
    categoryId: this.selectedCategory,
    userId: this.userId,
    PostPictures: this.selectedImageFile ? [this.selectedImageFile] : []
  };

  this.homeService.AddPost(post).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Post added successfully',
        timer: 2000,
        showConfirmButton: false
      });

      this.postContent = '';
      this.postedPhotos = [];
      this.selectedImageFile = null;
      this.selectedCategory = null;

      const modalEl = document.getElementById('photoUploadModal');
      if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance?.hide();
      }
    },
    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to add post',
        confirmButtonColor: '#d33'
      });
    }
  });
}

commentVisibility: { [postId: number]: boolean } = {};
likedPosts: { [postId: number]: boolean } = {};

toggleComments(postId: number): void {
  this.commentVisibility[postId] = !this.commentVisibility[postId];
}

toggleLike(postId: number): void {
  this.likedPosts[postId] = !this.likedPosts[postId];
}

likedComments: { [commentId: number]: boolean } = {};

toggleCommentLike(commentId: number): void {
  this.likedComments[commentId] = !this.likedComments[commentId];
}
editPost(post: any) {
  // Open edit modal or navigate to edit form
  console.log('Edit post:', post);
}

deletePost(postId: number) {
  if (confirm('Are you sure you want to delete this post?')) {
    this.homeService.deletePost(postId).subscribe(() => {
      this.userPosts = this.userPosts.filter((p: any)=> p.postId !== postId);
    });
  }
}

editComment(comment: any): void {
  // Handle opening edit input/modal
  console.log("Edit comment:", comment);
}

deleteComment(commentId: number): void {
  // Handle deletion logic
  console.log("Delete comment with ID:", commentId);
}

}
