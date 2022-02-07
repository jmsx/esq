import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quiz } from '../models/quiz';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(
    private http: HttpClient,
  ) { }

  getQuizs() {
    return this.http.get<Quiz[]>(environment.URL_BASE + 'quiz');
  }

  getQuiz(id: number) {
    return this.http.get<Quiz>(environment.URL_BASE + 'quiz/' + id);
  }

  createQuiz(quiz: Quiz) {
    return this.http.post(environment.URL_BASE + 'quiz/', quiz);
  }

  updateQuiz(quiz: Quiz) {
    return this.http.put(environment.URL_BASE + 'quiz/' + quiz.id + "/", quiz);
  }

  deleteQuiz(id: number) {
    return this.http.delete(environment.URL_BASE + 'quiz/' + id + "/");
  }
  
}
