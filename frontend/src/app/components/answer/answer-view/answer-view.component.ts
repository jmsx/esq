import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Answer } from 'src/app/models/answer';
import { AnswerMultipleChoice } from 'src/app/models/answer-multiple-choice';
import { AnswerRange } from 'src/app/models/answer-range';
import { AnswerShortAnswer } from 'src/app/models/answer-short-answer';
import { QuestionMultipleChoice } from 'src/app/models/question-multiple-choice';
import { ReportAnswer } from 'src/app/models/report-answer';
import { ReportAnswerService } from 'src/app/services/report-answer.service';


interface ReportAnswerMin{
  id: number;
  answers: AnswerMin[];
}
interface AnswerMin {
  text: string;
  value: string;
}



@Component({
  selector: 'app-answer-view',
  templateUrl: './answer-view.component.html',
  styleUrls: ['./answer-view.component.scss']
})


export class AnswerViewComponent implements OnInit {


  reportAnswers: ReportAnswer[];
  reportAnswerMins: ReportAnswerMin[];
  constructor(
    private reportAnswerService: ReportAnswerService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    let idQuiz: number = +this.route.snapshot.paramMap.get('id');
    this.reportAnswerService.getReportAnswerByQuiz(idQuiz).subscribe(
      (reportAnwsers: ReportAnswer[]) => {
        this.reportAnswers = reportAnwsers;
        this.reportAnswerMins = this.reportAnswers.map(
          (reportAnswer: ReportAnswer) => {
            return this.reportAnwserToMin(reportAnswer);
          }
        );
        console.log(this.reportAnswerMins);
      },
      () => {
        this.toastr.error("Error al obtener las respuestas");
      }
    );
  }


  reportAnwserToMin(reportAnwser: ReportAnswer): ReportAnswerMin {
    let answers: AnswerMin[] = reportAnwser.answers.map(
        (answer: (AnswerMultipleChoice | AnswerShortAnswer | AnswerRange)) => {
          let res;
          switch (answer.question.type_question) {
            case "SA":
              let answerSA: AnswerShortAnswer = answer as AnswerShortAnswer;
              res = {
                text: answer.question.text,
                value: answerSA.value
              } as AnswerMin;
              break;
            case "MCQ":
              let answerMCQ: AnswerMultipleChoice = answer as AnswerMultipleChoice;
              res = {
                text: answer.question.text,
                value: answerMCQ.answer_option.text
              } as AnswerMin;
              break;
            case "RQ":
              let answerRQ: AnswerRange = answer as AnswerRange;
              res = {
                text: answer.question.text,
                value: '' + answerRQ.value
              } as AnswerMin;
              break;
          }
          return res
        }
      );

    let reportMin: ReportAnswerMin = {
      id: reportAnwser.id,
      answers: answers
    };
    return reportMin;
  }

}
