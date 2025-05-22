import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7291/api';

  constructor(private http: HttpClient) { }

  register(registerData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Users/Register`, registerData);
  }

  login(loginData: any): Observable<any> {
    const params = new HttpParams()
        .set('UserName', loginData.UserName)
        .set('PasswordHash', loginData.PasswordHash);

    return this.http.get(`${this.apiUrl}/Login`, { params });
}
}
