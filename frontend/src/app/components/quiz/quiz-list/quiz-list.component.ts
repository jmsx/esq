import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Quiz } from 'src/app/models/quiz';
import { User } from 'src/app/models/user.model';
import { QuizService } from 'src/app/services/quiz.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {


  user: User
  ownQuizs: Quiz[];
  shareQuizs: Quiz[];

  constructor(
    private quizService: QuizService,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.getMyUser().subscribe(
      (user: User) => {
        this.user = user;
      }
    );
    this.quizService.getQuizs().subscribe(
      (quizs: Quiz[]) => {
        this.ownQuizs = quizs.filter(quiz => quiz.owner == this.user.id);
        this.shareQuizs = quizs.filter(quiz => quiz.owner != this.user.id);
      },
      () => {
        console.log('Error al obtener las encuestas');
      }
    );
  }

  navigateToQuiz(id: number) {
    this.router.navigate(['/dashboard/quizs', id]);
  }

  editQuiz(id: number) {
    this.router.navigate(['/dashboard/quizs/' + id + '/edit']);
  }

  deleteQuiz(id: number) {
    this.quizService.deleteQuiz(id).subscribe(
      () => {
        this.ownQuizs = this.ownQuizs.filter(quiz => quiz.id != id);
        this.toastr.success('Encuesta eliminada correctamente');
      },
      () => {
        this.toastr.error('Error al eliminar la encuesta');
      }
    );
  }

  newQuiz(){
    this.router.navigate(['/dashboard/quizs/0/edit']);
  }

}
