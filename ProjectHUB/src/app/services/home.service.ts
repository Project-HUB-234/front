import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }
    private apiUrl = 'https://localhost:7291/api';

      getUserData(userId: number): Observable<any> {
    const params = new HttpParams().set("userId", userId.toString())
    return this.http.get(`${this.apiUrl}/Users/user`, { params })
  }

    getUserPosts(userId: number): Observable<any> {
    const params = new HttpParams().set("userId", userId.toString())
    return this.http.get(`${this.apiUrl}/Posts/ByUser`, { params })
   }
   getPostCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/PostCategory`)
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
    const params = new HttpParams().set("postId", postId.toString())
    return this.http.delete(`${this.apiUrl}/Posts/DeletePost`, { params })
  }
    UpdatePost(post: any): Observable<any> {
    const formData = new FormData();
    formData.append('contant', post.contant);
    formData.append('categoryId', post.categoryId);
    formData.append('userId', post.userId);
    formData.append('postStatusId', post.postStatusId);
    formData.append('postId', post.postId);
    formData.append('attachmentId', post.attachmentId);
    formData.append('attachmentPath', post.attachmentPath);
    const file = post.attachment;
    if (file) {
      formData.append('attachment', file, file.name);
    }
    return this.http.put(`${this.apiUrl}/Posts/UpdatePost`, formData);
  }
}
