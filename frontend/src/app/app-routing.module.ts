import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnswerViewGroupComponent } from './components/answer/answer-view-group/answer-view-group.component';
import { AnswerViewComponent } from './components/answer/answer-view/answer-view.component';
import { QuizEditComponent } from './components/quiz/quiz-edit/quiz-edit.component';
import { QuizListComponent } from './components/quiz/quiz-list/quiz-list.component';
import { QuizComponent } from './components/respondent/quiz/quiz.component';
import { GridFunctionsComponent } from './components/statistics/grid-functions/grid-functions.component';
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
      {path: 'reportanswers/:id', component: AnswerViewComponent},
      {path: 'reportanswersgroup/:id', component: AnswerViewGroupComponent},

      //Statistics
      { path: 'statistics/:id', component: GridFunctionsComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
