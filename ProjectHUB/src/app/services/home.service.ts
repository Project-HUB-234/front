import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'https://localhost:7291/api';

  getUserData(userId: number): Observable<any> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get(`${this.apiUrl}/Users/user`, { params });
  }

  getUserPosts(userId: number): Observable<any> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get(`${this.apiUrl}/Posts/ByUser`, { params });
  }
  getPostCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/PostCategory`);
  }

  AddPost(post: any): Observable<any> {
    const formData = new FormData();
    formData.append('Content', post.content);
    formData.append('UserId', post.userId.toString());
    formData.append('PostCategory', post.categoryId.toString());

    const files = post.PostPictures as File[];
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('PostPictures', files[i], files[i].name);
      }
    }
    return this.http.post(`${this.apiUrl}/Posts/AddPost`, formData);
  }

  deletePost(postId: number): Observable<any> {
    //const params = new HttpParams().set("postId", postId.toString())
    return this.http.delete(`${this.apiUrl}/Posts/DeletePost/` + postId);
  }
  UpdatePost(post: any): Observable<any> {
    const formData = new FormData();
    formData.append('content', post.contant);
    formData.append('PostCategory', post.categoryId);
    //formData.append('userId', post.userId);
    //formData.append('postStatusId', post.postStatusId);
    formData.append('postId', post.postId);
    //formData.append('attachmentId', post.attachmentId);
    //formData.append('attachmentPath', post.attachmentPath);
    const files = post.PostPictures as File[];

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('PostPictures', files[i], files[i].name);
      }
    }
    return this.http.put(`${this.apiUrl}/Posts/UpdatePost`, formData);
  }

  getAllPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Posts`);
  }

  addLike(postId: number, userId: number) {
    return this.http.get(
      `${this.apiUrl}/PostLikes/AddLike/${postId}/${userId}`
    );
  }
  deleteLike(postId: number, userId: number) {
    return this.http.delete(`${this.apiUrl}/PostLikes/${postId}/${userId}`);
  }
  addComment(comment: any) {
    const formData = new FormData();
    formData.append('Contant', comment.commentText);
    formData.append('PostId', comment.PostId);
    formData.append('userId', comment.userId);
    const file = comment.commentImage as File;
    if (file) {
      formData.append('image', file, file.name);
    }
    return this.http.post(`${this.apiUrl}/Comment`, formData);
  }

  userPostLike(userId: number) {
    return this.http.get(`${this.apiUrl}/PostLikes/ByUser/${userId}`);
  }
  userCommentLike(userId: number) {
    return this.http.get(`${this.apiUrl}/CommentLikes/${userId}`);
  }

  addCommentLike(commentId: number, userId: number) {
    return this.http.get(`${this.apiUrl}/CommentLikes/${commentId}/${userId}`);
  }
  deleteCommentLike(commentId: number, userId: number) {
    return this.http.delete(
      `${this.apiUrl}/CommentLikes/${commentId}/${userId}`
    );
  }

  deleteComment(commentId: number) {
    return this.http.delete(`${this.apiUrl}/Comment/${commentId}`);
  }
  editCommentLike(comment: any) {
    const formData = new FormData();
    formData.append('CommentId', comment.commentId);
    formData.append('Content', comment.commentText);
    formData.append('RemoveImage', comment.removeImage);
    const file = comment.commentImage as File;
    if (file) {
      formData.append('Image', file, file.name);
    }
    return this.http.put(`${this.apiUrl}/Comment`, formData);
  }

  updateProfile(userData:any){
    const formData = new FormData();
    formData.append('UserId', userData.userId);
    formData.append('UserName', userData.email);
    formData.append('FirstName', userData.firstName);
    formData.append('LastName', userData.lastName);
    formData.append('PhoneNumber', userData.phoneNumber);
    formData.append('Brif', userData.brif);
    formData.append('Address', userData.address);
    formData.append('Job', userData.job);

    const file1 = userData.profilePicture as File;
    if (file1) {
      formData.append('ProfilePicture', file1, file1.name);
    }
    const file2 = userData.quickAccessQrcode as File;
    if (file2) {
      formData.append('QuickAccessQrcode', file2, file2.name);
    } 
       const file3 = userData.backgroundPicture as File;
    if (file3) {
      formData.append('BackgroundPicture', file3, file3.name);
    }
    return this.http.put(`${this.apiUrl}/Users/update`, formData);
  }
}
