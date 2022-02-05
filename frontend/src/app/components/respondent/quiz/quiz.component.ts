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
import { ToastrService } from 'ngx-toastr';



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
    private toastr: ToastrService
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

    if(this.reportAnswer?.id !== undefined) {
      reportAnswer.id = this.reportAnswer.id;
      this.reportAnswerService.updateReportAnswer(reportAnswer).subscribe(
        (reportAnswer: ReportAnswer) => {
  
          this.reportAnswer = reportAnswer;
          this.toastr.success("Los datos han sido actualizados", "Envio correcto!");
        },
        () => {
          this.toastr.error("Error al actualizar el reporte", "Error!")
        }
      );
    }else{
      this.reportAnswerService.createReportAnswer(reportAnswer).subscribe(
        (reportAnswer: ReportAnswer) => {
  
          this.reportAnswer = reportAnswer;
          this.toastr.success("Los datos han sido guardados", "Envio correcto!");
        },
        () => {
          this.toastr.error("Error al guardar el reporte", "Error!")
        }
      );
    }

    
  } 

  generateForm() {
    let formGroup = new FormGroup({});
    this.quiz.questions.forEach(question => {
      formGroup.addControl("question-" + this.quiz.id + "-" + question.id, new FormControl(''));
    });
    this.formGroup = formGroup;
  }

}
