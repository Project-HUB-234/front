import { Component,ViewChild,TemplateRef } from '@angular/core';
import { HomeService } from '../services/home.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { MatDialog,MatDialogRef  } from '@angular/material/dialog';

declare var bootstrap: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  private modal: any;
  dialogRef!: MatDialogRef<any>;

  constructor(private homeService : HomeService, private toastr:ToastrService ,public dialog: MatDialog,) {}
  @ViewChild('callEditPostDialog') EditPostDialog !: TemplateRef<any>;
   @ViewChild('callDeletePostDialog') DeletePostDialog!: TemplateRef<any>;
   @ViewChild('callEditCommentDialog') EditCommentDialog !: TemplateRef<any>;
    @ViewChild('callDeleteCommentDialog') DeleteCommentDialog !: TemplateRef<any>;

  ngAfterViewInit() {
    this.modal = new bootstrap.Modal(document.getElementById('photoUploadModal'));
  }

 userId : number|undefined ;
 ngOnInit(): void {
    this.userId = Number(localStorage.getItem("userId"));
     console.log(this.userId);
    if(this.userId){
     this.getUserData();
     this.getAllPosts();
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
  userPosts: any = null ;
     postsCount: number=0;

    getAllPosts(): void {
    this.homeService.getAllPosts().subscribe(
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

  //Search 
    searchQuery = '';
 onSearch(): void {
    console.log('Searching for:', this.searchQuery);
    // Add your logic to fetch posts by this.searchQuery/category
  }

  onCategorySelected(categoryName: string): void {
    this.searchQuery = categoryName;
    console.log('Category selected:', categoryName);
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

removePhoto(): void {
  this.editedCommentPhoto = null;
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


removeCommentImage(): void {
  this.commentImage = null;
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



editComment(comment: any): void {
  // Handle opening edit input/modal
  console.log("Edit comment:", comment);
}

deleteComment(commentId: number): void {
  // Handle deletion logic
  console.log("Delete comment with ID:", commentId);
}

deletePost(postId:number){

}
  logout(){

  }


}
