import { Component, TemplateRef, ViewChild } from '@angular/core';
import { HomeService } from '../services/home.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
declare var bootstrap: any;


@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.component.html',
  styleUrls: ['./other-profile.component.css']
})
export class OtherProfileComponent {
  private modal: any;
  dialogRef!: MatDialogRef<any>;

  constructor(
    private homeService: HomeService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}
  @ViewChild('callEditCommentDialog') EditCommentDialog!: TemplateRef<any>;
  @ViewChild('callDeleteCommentDialog') DeleteCommentDialog!: TemplateRef<any>;
  @ViewChild('callImageDialog') ImageDialog!: TemplateRef<any>;
  ngAfterViewInit() {
    this.modal = new bootstrap.Modal(
      document.getElementById('photoUploadModal')
    );
  }
  userId: number | undefined;
  otherUserId: number | undefined;
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.otherUserId = +params.get('id')!;
      this.userId = +localStorage.getItem('userId')!;
      this.getUserData();
      this.getUserPosts();
      this.UserPostLike();
      this.UserCommentLike();
    });
  }
  userProfile: any = null;
  getUserData() {
    this.homeService.getUserData(this.otherUserId!).subscribe((result: any) => {
      this.userProfile = result;
    });
  }
  userPosts: any = null;
  postsCount: number = 0;
  getUserPosts(): void {
 
    this.homeService.getUserPosts(this.otherUserId!).subscribe(
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
  picturePath: string | null = null;
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
    this.homeService.getUserPosts(this.otherUserId!).subscribe(
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
    this.homeService.getUserPosts(this.otherUserId!).subscribe(
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
