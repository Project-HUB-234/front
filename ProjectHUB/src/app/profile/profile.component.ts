import { Component ,TemplateRef, ViewChild  } from '@angular/core';
import { HomeService } from '../services/home.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { MatDialog,MatDialogRef  } from '@angular/material/dialog';

declare var bootstrap: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
 
  private modal: any;
  dialogRef!: MatDialogRef<any>;

  constructor(private homeService : HomeService, private toastr:ToastrService ,public dialog: MatDialog,) {}
  @ViewChild('callEditPostDialog') EditPostDialog !: TemplateRef<any>;
   @ViewChild('callDeletePostDialog') DeletePostDialog!: TemplateRef<any>;
   @ViewChild('callEditCommentDialog') EditCommentDialog !: TemplateRef<any>;
    @ViewChild('callDeleteCommentDialog') DeleteCommentDialog !: TemplateRef<any>;
@ViewChild('callImageDialog') ImageDialog !: TemplateRef<any>;

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

// Add image validation properties
readonly maxFileSize = 5 * 1024 * 1024; // 5MB
readonly allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif'];

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  if (!this.allowedFileTypes.includes(file.type)) {
    this.toastr.error('Please upload only images (JPEG, PNG, or GIF)');
    return;
  }

  // Validate file size
  if (file.size > this.maxFileSize) {
    this.toastr.error('File size should not exceed 5MB');
    return;
  }

  this.selectedImageFile = file;
  const reader = new FileReader();
  
  reader.onload = () => {
    this.postedPhotos = [reader.result as string];
  };

  reader.onerror = () => {
    this.toastr.error('Error reading file');
    this.selectedImageFile = null;
    this.postedPhotos = [];
  };

  reader.readAsDataURL(file);
}

removeSelectedImage() {
  this.selectedImageFile = null;
  this.postedPhotos = [];
}

postPhoto() {
  if (!this.selectedCategory) {
    this.toastr.warning('Please select a category');
    return;
  }

  const formData = new FormData();
  formData.append('content', this.postContent);
  formData.append('categoryId', this.selectedCategory);
  formData.append('userId', this.userId!.toString());
  
  if (this.selectedImageFile) {
    formData.append('PostPictures', this.selectedImageFile);
  }

  this.homeService.AddPost(formData).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Post added successfully',
        timer: 2000,
        showConfirmButton: false
      });

      // Reset form
      this.postContent = '';
      this.postedPhotos = [];
      this.selectedImageFile = null;
      this.selectedCategory = null;

      // Refresh posts
      this.getUserPosts();

      // Close modal
      const modalEl = document.getElementById('photoUploadModal');
      if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        modalInstance?.hide();
      }
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message || 'Failed to add post',
        confirmButtonColor: '#d33'
      });
    }
  });
}




  openEditPostDialog(post:any) {
     this.dialog.open(this.EditPostDialog)
   }
   saveEditPost(data:any){

   }
 openDeletePostDialog(postId:number) {
     this.dialog.open(this.DeletePostDialog)
   } 
   confirmDeletePost(){

   }

//COMMENT
   commentImage: string | ArrayBuffer | null = null;
  commentText: string = '';
onCommentImageSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => this.commentImage = reader.result;
    reader.readAsDataURL(file);
  }
}
sendComment(): void {}

removeCommentImage(): void {
  this.commentImage = null;
}

editedCommentText: string = '';
editedCommentPhoto: string | ArrayBuffer | null = null;

onPhotoSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => this.editedCommentPhoto = reader.result;
    reader.readAsDataURL(input.files[0]);
  }
}

removePhoto(): void {
  this.editedCommentPhoto = null;
}

   openEditCommentDialog(comment:any) {
     this.dialog.open(this.EditCommentDialog)
   }
   saveEditedComment(){
    
   }

   openDeleteCommentDialog(commentId:number) {
     this.dialog.open(this.DeleteCommentDialog)
   }
   confirmDeleteComment(){

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
mediaUrls: string[] = [
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
];
selectedImage: string = '';

openDialog(imageUrl: string): void {
  this.selectedImage = imageUrl;
  this.dialog.open(this.ImageDialog, {
    panelClass: 'custom-dialog-container',
  });
}
}
