import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user: User;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
  ) { }


  ngOnInit(): void {
    this.userService.getMyUser().subscribe(
      (user: User) => {
        this.user = user;
        this.toastr.success('Bienvenido ' + user.first_name + "!");
      }
    );
  }

  urlGvatar(email: string) {
    return `https://www.gravatar.com/avatar/${Md5.hashStr(email)}?s=200`;
  }

}
