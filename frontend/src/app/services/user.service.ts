import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private JwtHelperService: JwtHelperService,
    private http: HttpClient,
    private auth: AuthService,
  ) { }

  getMyUser(){
    let token = this.auth.getToken();
    let res = undefined
    if (token) {
      let decode = this.JwtHelperService.decodeToken(token);
      let userId = decode.user_id;
      res =  this.http.get<User>(environment.URL_BASE + 'user/' + userId);
    }

    return res;
  }
}
