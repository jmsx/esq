import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReportAnswer } from '../models/report-answer';

@Injectable({
  providedIn: 'root'
})
export class ReportAnswerService {

  constructor(
    private http: HttpClient,
  ) { }

  getReportAnswers() {
    this.http.get<ReportAnswer[]>(environment.URL_BASE + 'reportanswer');
  }
  
  getReportAnswer(id: number) {
    return this.http.get<ReportAnswer>(environment.URL_BASE + 'reportanswer/' + id);
  }

  createReportAnswer(reportAnswer: ReportAnswer) {
    return this.http.post(environment.URL_BASE + 'reportanswer/', reportAnswer);
  }

  updateReportAnswer(reportAnswer: ReportAnswer) {
    return this.http.put(environment.URL_BASE + 'reportanswer/' + reportAnswer.id, reportAnswer);
  }

  deleteReportAnswer(id: number) {
    return this.http.delete(environment.URL_BASE + 'reportanswer/' + id);
  }
  
}
