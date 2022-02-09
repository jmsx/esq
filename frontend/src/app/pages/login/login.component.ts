import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Token } from 'src/app/models/token';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
  }

  login() {
    this.auth.login(this.username, this.password).subscribe(
      (res: Token) => {
        console.log(res);
        this.auth.saveToken(res.access, res.refresh);
        this.toastr.success('Iniciaste sesión correctamente');
        this.userService.getMyUser().subscribe(
          (user: User) => {
            this.userService.user = user;
          },
          (err) => {
            this.toastr.error('No se pudo obtener el usuario');
            this.router.navigate(['/']);
          }
        );
        this.router.navigate(['/dashboard/quizs']);

      },
      (err) => {
        this.toastr.error('Usuario o contraseña incorrectos', 'Error');
      }
    );
  }

}
