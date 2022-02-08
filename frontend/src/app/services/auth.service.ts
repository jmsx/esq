import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Token } from '../models/token';
import { from, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { convertTypeAcquisitionFromJson } from 'typescript';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private helper: JwtHelperService,
  ) { }

  
  getToken() {
    let token = localStorage.getItem('auth_token') === null ? undefined : localStorage.getItem('auth_token');
    let refresh = localStorage.getItem('auth_refresh') === null ? undefined : localStorage.getItem('auth_refresh');
    if (token) {
      try {
        if (this.helper.isTokenExpired(token)) {
          this.removeToken()
        }else{
          return token;
        }
      } catch (exception) {
        this.removeToken()
      }
    }
  }

  saveToken(token: string, refresh: string) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_refresh', refresh);
  }

  removeToken() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refresh');
  }

  // Request token from server
  login(username: string, password: string): Observable<Token> {
    return this.http.post<Token>(environment.URL_BASE + 'token/', {
      username: username,
      password: password
    });
  }

  refreshToken():Observable<Token> {
    return this.http.post<Token>(environment.URL_BASE + 'token/refresh/', {
      refresh: this.getToken()
    });
  }

  isAuthenticated(): boolean {
    return !this.helper.isTokenExpired(this.getToken());
  }

  logout() {
    this.removeToken();
  }

}
