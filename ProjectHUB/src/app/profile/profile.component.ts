import { Component, TemplateRef, ViewChild } from '@angular/core';
import { HomeService } from '../services/home.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

declare var bootstrap: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  private modal: any;
  dialogRef!: MatDialogRef<any>;

  constructor(
    private homeService: HomeService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}
  @ViewChild('callEditPostDialog') EditPostDialog!: TemplateRef<any>;
  @ViewChild('callDeletePostDialog') DeletePostDialog!: TemplateRef<any>;
  @ViewChild('callEditCommentDialog') EditCommentDialog!: TemplateRef<any>;
  @ViewChild('callDeleteCommentDialog') DeleteCommentDialog!: TemplateRef<any>;
  @ViewChild('callImageDialog') ImageDialog!: TemplateRef<any>;

  ngAfterViewInit() {
    this.modal = new bootstrap.Modal(
      document.getElementById('photoUploadModal')
    );
  }

  userId: number | undefined;
  postId = 0;
  content = '';
  picturePath = null;
  postEditPhotos: string[] = [];
  categoryId = 0;
  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    console.log(this.userId);
    if (this.userId) {
      this.getUserData();
      this.getUserPosts();
      this.getPostCategories();
      this.UserPostLike();
      this.UserCommentLike();
    }
  }

  userProfile: any = null;
  getUserData() {
    this.homeService.getUserData(this.userId!).subscribe(
      (result: any) => {
        if (result) {
          this.userProfile = result;
          console.log(this.userProfile);
        }
      },
      (error) => {
        this.toastr.error('Something went wrong. Please try again.');
      }
    );
  }

  postCategories: any[] = [];
  selectedCategory: any = null;
  onCategoryChange(value: any) {
    this.selectedCategory = value;
  }
  onCategoryEditChange(value: any) {
    this.categoryId = value;
  }
  getPostCategories() {
    this.homeService.getPostCategories().subscribe(
      (result: any) => {
        if (result) {
          this.postCategories = result;
          console.log(this.postCategories);
        }
      },
      (error) => {
        this.toastr.error('Failed to get categories');
      }
    );
  }

  userPosts: any = null;
  postsCount: number = 0;

  getUserPosts(): void {
 
    this.homeService.getUserPosts(this.userId!).subscribe(
      (result: any) => {
        if (result) {
          this.userPosts = result.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          this.postsCount = result.userPosts;
          const postIds = this.userPosts.map((post:any) => post.postId);
          const commentIds =  this.userPosts.flatMap((post:any) => post.comments.map((c:any) => c.commentId));

          this.postLikeCount(postIds);
          this.commentLikeCount(commentIds);
          this.getAllAttachments(postIds);
          this.UserPostLike();
          this.UserCommentLike();
        }
        console.log('ffff', this.userPosts);
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
  onEditImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.picturePath = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.postEditPhotos = [reader.result as string];
      };
      reader.readAsDataURL(file);
    }
  }
  postPhoto() {
    if (!this.selectedCategory) {
      this.toastr.warning('Please select a category');
      return;
    }

    const formData = {
      content: this.postContent,
      categoryId: this.selectedCategory,
      userId: this.userId!.toString(),
      PostPictures: this.selectedImageFile ? [this.selectedImageFile] : []
    };
    // Reset form
    this.postContent = '';
    this.postedPhotos = [];
    this.selectedImageFile = null;
    this.selectedCategory = null;
    this.homeService.AddPost(formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Post added successfully',
          timer: 2000,
          showConfirmButton: false,
        });

    

        // Refresh posts
        this.getUserPosts();

        // Close modal
        const modalEl = document.getElementById('photoUploadModal');
        if (modalEl) {
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          modalInstance?.hide();
        }
        this.getUserPosts();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message || 'Failed to add post',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  openEditPostDialog(post: any) {
    this.postEditPhotos = [];
    if (post.attachments.length > 0)
      this.postEditPhotos.push(post.attachments[0].attachmentPath);
    this.postId = post.postId;
    this.content = post.content;
    this.picturePath = null;
    this.categoryId = post.categoryId;
    this.dialog.open(this.EditPostDialog);
  }

  saveEditPost() {
    const post = {
      contant: this.content,
      categoryId: this.categoryId,
      postId: this.postId,
      PostPictures: this.picturePath ? [this.picturePath] : [],
    };

    this.homeService.UpdatePost(post).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Post updated successfully',
          timer: 2000,
          showConfirmButton: false,
        });

        this.picturePath = null;

        const modalEl = document.getElementById('photoUploadModal');
        if (modalEl) {
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          modalInstance?.hide();
        }
        this.getUserPosts();
        this.dialog.closeAll();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to update post',
          confirmButtonColor: '#d33',
        });
      },
    });
  }
  openDeletePostDialog(postId: number) {
    this.postId = postId;
    this.dialog.open(this.DeletePostDialog);
  }
  confirmDeletePost() {
    this.homeService.deletePost(this.postId).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Post deleted successfully',
          timer: 2000,
          showConfirmButton: false,
        });

        this.picturePath = null;

        const modalEl = document.getElementById('photoUploadModal');
        if (modalEl) {
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          modalInstance?.hide();
        }
        this.getUserPosts();
        this.dialog.closeAll();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to delete post',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  //COMMENT
  commentImage: string | ArrayBuffer | null = null;
  commentText: string = '';
  commentSelectedImage = null;
  onCommentImageSelected(event: any): void {
    this.commentSelectedImage = null;
    const file = event.target.files[0];
    if (file) {
      this.commentSelectedImage = file;

      const reader = new FileReader();
      reader.onload = (e) => (this.commentImage = reader.result);
      reader.readAsDataURL(file);
    }
  }
  sendComment(postId: number) {
    const comment = {
      commentImage: this.commentSelectedImage,
      commentText: this.commentText,
      PostId: postId,
      userId: this.userId,
    };
    this.homeService.addComment(comment).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Comment added successfully',
          timer: 2000,
          showConfirmButton: false,
        });

        this.commentSelectedImage = null;
        this.picturePath = null;
        this.commentText = '';
        this.commentImage = null;

        const modalEl = document.getElementById('photoUploadModal');
        if (modalEl) {
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          modalInstance?.hide();
        }
        this.getUserPosts();
        this.dialog.closeAll();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to add comment',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  removeCommentImage(): void {
    this.commentImage = null;
  }
  editedCommentId: number = 0;
  editedCommentText: string = "";
  editedCommentPhoto: string | ArrayBuffer | null = null;
  editedCommentFile: File | null = null;

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.removeCommentPicture = false; 
      this.editedCommentFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => (this.editedCommentPhoto = reader.result);
      reader.readAsDataURL(input.files[0]);
    }
  }
  removeCommentPicture : boolean = false;

  removePhoto(): void {
    this.editedCommentPhoto = null;
    this.editedCommentFile = null
    this.removeCommentPicture = true;
  }

  openEditCommentDialog(comment: any) {
    this.removeCommentPicture = false;  
    this.editedCommentText = comment.content;
    if (comment.attachments.length > 0) {
      this.editedCommentPhoto = comment.attachments[0].attachmentPath;
    }
    else{
      this.editedCommentPhoto = null;
    }
    this.editedCommentId = comment.commentId;
    this.dialog.open(this.EditCommentDialog);
  }
  saveEditedComment() {
    const comment = {
      commentId: this.editedCommentId,
      commentText: this.editedCommentText,
      commentImage: this.editedCommentFile,
      removeImage: this.removeCommentPicture,
    }
    this.homeService.editCommentLike(comment).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Comment edited successfully',
          timer: 2000,
          showConfirmButton: false,
        });

        this.picturePath = null;

        const modalEl = document.getElementById('photoUploadModal');
        if (modalEl) {
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          modalInstance?.hide();
        }
        this.getUserPosts();
        this.dialog.closeAll();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to edit Comment',
          confirmButtonColor: '#d33',
        });
      },
    });
  }
  commentToDelete = 0;
  openDeleteCommentDialog(commentId: number) {
    this.commentToDelete = commentId;
    this.dialog.open(this.DeleteCommentDialog);
  }
  confirmDeleteComment() {
    this.homeService.deleteComment(this.commentToDelete).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Comment deleted successfully',
          timer: 2000,
          showConfirmButton: false,
        });

        this.picturePath = null;

        const modalEl = document.getElementById('photoUploadModal');
        if (modalEl) {
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          modalInstance?.hide();
        }
        this.getUserPosts();
        this.dialog.closeAll();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to delete Comment',
          confirmButtonColor: '#d33',
        });
      },
    });
  }

  commentVisibility: { [postId: number]: boolean } = {};
  likedPosts: { [postId: number]: boolean } = {};

  toggleComments(postId: number): void {
    this.commentVisibility[postId] = !this.commentVisibility[postId];
  }

  toggleLike(postId: number): void {
    this.homeService.addLike(postId, this.userId!).subscribe({});
    this.getUserPosts();
  }

  likedComments: { [commentId: number]: boolean } = {};

  toggleCommentLike(commentId: number): void {
    this.likedComments[commentId] = !this.likedComments[commentId];
  }
  

  deletePost(postId: number) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.homeService.deletePost(postId).subscribe(() => {
        this.userPosts = this.userPosts.filter((p: any) => p.postId !== postId);
      });
    }
  }

  userPostLike: any;
  UserPostLike() {
    this.homeService.userPostLike(this.userId!).subscribe((result) => {
      if (result) {
        this.userPostLike = result;
      }
    });
  }
  userCommentLike: any;
  UserCommentLike() {
    this.homeService.userCommentLike(this.userId!).subscribe((result) => {
      if (result) {
        this.userCommentLike = result;
      }
    });
  }
  deleteLike(postId: number) {
    this.homeService.deleteLike(postId, this.userId!).subscribe({});
    this.getUserPosts();
  }
  addCommentLike(commentId: number) {
    this.homeService.addCommentLike(commentId, this.userId!).subscribe({});
    this.getUserPosts();
  }
  deleteCommentLike(commentId: number) {
    this.homeService.deleteCommentLike(commentId, this.userId!).subscribe({});
    this.getUserPosts();
  }
  isLiked(Id: number) {
    if (this.userPostLike.includes(Id)) {
      return true;
    }
    return false;
  }
  isCommentLiked(Id: number) {
    if (this.userCommentLike.includes(Id)) {
      return true;
    }
    return false;
  }

  selectedImage: string = '';

  openDialog(imageUrl: string): void {
    this.selectedImage = imageUrl;
    this.dialog.open(this.ImageDialog, {
      panelClass: 'custom-dialog-container',
    });
  }
  postLikeCountmap: any;
  postLikeCount(postId: number[]){
    this.homeService.PostLikeCount(postId).subscribe((result) => {
      this.postLikeCountmap = result;
    });
    this.homeService.getUserPosts(this.userId!).subscribe(
      (result: any) => {
        if (result) {
          this.userPosts = result.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          this.postsCount = result.userPosts;
        }
      },
      (error) => {
        this.toastr.error('Failed to load posts. Please refresh.');
      }
    );
 
  }
  commetLikeCountmap: any;
  commentLikeCount(commentId: number){
    this.homeService.CommentLikeCount(commentId).subscribe((result) => {
      this.commetLikeCountmap = result;
    });
    this.homeService.getUserPosts(this.userId!).subscribe(
      (result: any) => {
        if (result) {
          this.userPosts = result.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          this.postsCount = result.userPosts;
        }
      },
      (error) => {
        this.toastr.error('Failed to load posts. Please refresh.');
      }
    );
  }

  getLikeCount(postId: number): number {
    const found = this.postLikeCountmap.find((item: any) => item.postId === postId);
    return found ? found.likeCount : 0;
  }
  getCommentLikeCount(commentId: number): number {
    const found = this.commetLikeCountmap.find((item: any) => item.commentId === commentId);
    return found ? found.likeCount : 0;
  }
  allAttachments: string[] = [];
  getAllAttachments(postId: number[]) {
    this.homeService.getAllAttachments(postId).subscribe((result:any) => {
      this.allAttachments = result;
    });
  }
}
