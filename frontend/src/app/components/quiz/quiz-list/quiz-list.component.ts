import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    this.router.navigate(['/quizs', id]);
  }

}
