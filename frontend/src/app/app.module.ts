import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuizComponent } from './components/respondent/quiz/quiz.component';
import { HttpClientModule } from '@angular/common/http';
import { QuizListComponent } from './components/quiz/quiz-list/quiz-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuizEditComponent } from './components/quiz/quiz-edit/quiz-edit.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { JwtHelperService, JWT_OPTIONS   } from '@auth0/angular-jwt';


@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    QuizListComponent,
    QuizEditComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule,
    FormsModule
    
  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
