import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizListComponent } from './components/quiz/quiz-list/quiz-list.component';
import { QuizComponent } from './components/respondent/quiz/quiz.component';

const routes: Routes = [
  {path: '', redirectTo: 'quizs', pathMatch: 'full'},
  {path: 'quizs', component: QuizListComponent},
  {path: 'quizs/:id', component: QuizComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
