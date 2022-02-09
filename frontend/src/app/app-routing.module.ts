import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnswerViewComponent } from './components/answer/answer-view/answer-view.component';
import { QuizEditComponent } from './components/quiz/quiz-edit/quiz-edit.component';
import { QuizListComponent } from './components/quiz/quiz-list/quiz-list.component';
import { QuizComponent } from './components/respondent/quiz/quiz.component';
import { Answer } from './models/answer';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService],
    children: [

      //Quiz
      {path: 'quizs', component: QuizListComponent},
      {path: 'quizs/:id', component: QuizComponent},
      {path: 'quizs/:id/edit', component: QuizEditComponent},

      //ReportAnswer
      {path: 'reportanswers/:idQuiz', component: AnswerViewComponent},
    ]
  },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
