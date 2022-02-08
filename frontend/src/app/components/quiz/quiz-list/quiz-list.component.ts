import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Quiz } from 'src/app/models/quiz';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html',
  styleUrls: ['./quiz-list.component.scss']
})
export class QuizListComponent implements OnInit {

  quizs: Quiz[];

  constructor(
    private quizService: QuizService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.quizService.getQuizs().subscribe(
      (quizs: Quiz[]) => {
        console.log('Encuenstas:' + quizs.length);
        this.quizs = quizs;
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
        this.quizs = this.quizs.filter(quiz => quiz.id != id);
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
