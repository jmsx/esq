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
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { AnswerShortAnswer } from 'src/app/models/answer-short-answer';
import { AnswerMultipleChoice } from 'src/app/models/answer-multiple-choice';
import { QuestionMultipleChoice } from 'src/app/models/question-multiple-choice';
import { QuestionShortAnswer } from 'src/app/models/question-short-answer';
import { QuestionRange } from 'src/app/models/question-range';
import { AnswerRange } from 'src/app/models/answer-range';



@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  reportAnswer: ReportAnswer;
  formGroup: FormGroup;
  quiz: Quiz;
  user: User;
  
  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private reportAnswerService: ReportAnswerService,
    private toastr: ToastrService,
    private userService: UserService,
    private router: Router

  ) { }

  ngOnInit(): void {
    let id: number = +this.route.snapshot.paramMap.get('id');
    this.userService.getMyUser().subscribe(
      (user: User) => {
        this.user = user;
      },
      () => {
        this.toastr.error("Error al obtener el usuario");
        this.router.navigate(['/login']);
      }
    );
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
      user: this.user.id,
      answers: []
    };

    this.quiz.questions.forEach(
      (question: (QuestionMultipleChoice | QuestionShortAnswer | QuestionRange)) => {   
        let answer;  
        switch(question.type_question){
          case 'MCQ':
            answer = new AnswerMultipleChoice({
              question: question,
              answer_option: (<QuestionMultipleChoice>this.quiz.questions.find(q => q.id == question.id)).options.find(o => o.id == +this.formGroup.get("question-" + this.quiz.id + "-" + question.id).value) 
            });
            break;
          case 'SA':
            answer = new AnswerShortAnswer({
              question: question,
              value: this.formGroup.get("question-" + this.quiz.id + "-" + question.id).value
            } as AnswerShortAnswer);
            break;
          case 'RQ':
            answer = new AnswerRange({
              question: question,
              value: this.formGroup.get("question-" + this.quiz.id + "-" + question.id).value
            });
            break;
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
