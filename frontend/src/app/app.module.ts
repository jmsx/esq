import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuizComponent } from './components/respondent/quiz/quiz.component';
import { HttpClientModule } from '@angular/common/http';
import { QuizListComponent } from './components/quiz/quiz-list/quiz-list.component';
import { ReactiveFormsModule } from '@angular/forms';

import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuizEditComponent } from './components/quiz/quiz-edit/quiz-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    QuizListComponent,
    QuizEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
