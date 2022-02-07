import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizEditComponent } from './components/quiz/quiz-edit/quiz-edit.component';
import { QuizListComponent } from './components/quiz/quiz-list/quiz-list.component';
import { QuizComponent } from './components/respondent/quiz/quiz.component';

const routes: Routes = [
  {path: '', redirectTo: 'quizs', pathMatch: 'full'},
  {path: 'quizs', component: QuizListComponent},
  {path: 'quizs/:id', component: QuizComponent},
  {path: 'quizs/:id/edit', component: QuizEditComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
