import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'https://localhost:7291/api';

  getUserData(userId: number): Observable<any> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.get(`${this.apiUrl}/Users/user`, { params });
  }
  getAllUsers(): Observable<any>{
    return this.http.get(`${this.apiUrl}/Users`)
  }
  deleteUser(id: number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/Users/${id}`)
  }
  updateUser(user: any): Observable<any>{
    console.log(user);
    const formData = new FormData();
    formData.append('UserId', user.UserId);
    formData.append('Brif', user.Brif);
    formData.append('UserName', user.Email); 
    formData.append('FirstName', user.FirstName);
    formData.append('LastName', user.LastName);
    formData.append('PhoneNumber', user.PhoneNumber);
    formData.append('Job', user.Job);
    formData.append('Address', user.Address);


    let file = user.ProfilePicture as File; 
    if (file) {
        formData.append('ProfilePicture', file, file.name);
    }
     file = user.BackgroundPicture as File; 
    if (file) {
        formData.append('BackgroundPicture', file, file.name);
    }
     file = user.QuickAccessQrcode as File; 
    if (file) {
        formData.append('QuickAccessQrcode', file, file.name);
    }
    return this.http.put(`${this.apiUrl}/Users/update`, formData)
  }

  getPostCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/PostCategory`);
  }
  addPostCategory(category: { CategoryName: string }) {
    return this.http.post(`${this.apiUrl}/PostCategory`, category);
  }
  deleteCategory(id: number) {
    return this.http.delete(`${this.apiUrl}/PostCategory/${id}`);
  }
  updateCategory(data: { id: number, categoryName: string }) {
    return this.http.put(`${this.apiUrl}/PostCategory`, data);
  }
  getContact(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ContactUs`);
  }
  
  deleteContact(id: number) {
    return this.http.delete(`${this.apiUrl}/ContactUs/${id}`);
  }
  

}
