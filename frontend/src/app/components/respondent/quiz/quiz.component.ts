import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from 'src/app/models/quiz';
import { QuizService } from 'src/app/services/quiz.service';
import {FormControl, 
  FormGroup,
  FormBuilder,
  FormArray,
  Validators} from '@angular/forms';
import { ReportAnswer } from 'src/app/models/report-answer';
import { Question } from 'src/app/models/question';
import { Answer } from 'src/app/models/answer';
import { ReportAnswerService } from 'src/app/services/report-answer.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  reportAnswer: ReportAnswer;
  formGroup: FormGroup;
  quiz: Quiz;
  
  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private reportAnswerService: ReportAnswerService,

  ) { }

  ngOnInit(): void {
    let id: number = +this.route.snapshot.paramMap.get('id');
    this.quizService.getQuiz(id).subscribe(
      (quiz: Quiz) => {
        this.quiz = quiz;
        this.generateForm();
        console.log(this.quiz)
      }
    );
  }

  saveReportAnswer() {
    let reportAnswer: ReportAnswer = {
      quiz: this.quiz.id,
      user: 1,
      answers: []
    };
    this.quiz.questions.forEach((question: Question) => {
      let answer: Answer;
      if(question.type_question === 'SA') {
        answer = {
          question: question,
          answer_text: this.formGroup.get("question-" + this.quiz.id + "-" + question.id).value
        };
      } else if(question.type_question === 'MCQ') {
        answer = {
          question: question,
          answer_option: this.quiz.questions.find(q => q.id == question.id).options.find(o => o.id == +this.formGroup.get("question-" + this.quiz.id + "-" + question.id).value) 
        };
      }
      reportAnswer.answers.push(answer);
    });

    console.log(reportAnswer);
    this.reportAnswerService.createReportAnswer(reportAnswer).subscribe(
      (reportAnswer: ReportAnswer) => {
        console.log("Reporte guardado");
        console.log(reportAnswer);
      },
      () => {
        console.log("Error al guardar el reporte");
      }
    );
  }

  generateForm() {
    let formGroup = new FormGroup({});
    this.quiz.questions.forEach(question => {
      formGroup.addControl("question-" + this.quiz.id + "-" + question.id, new FormControl(''));
    });
    this.formGroup = formGroup;
  }

}
