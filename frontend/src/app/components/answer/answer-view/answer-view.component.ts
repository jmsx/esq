import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Answer } from 'src/app/models/answer';
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
        (answer: Answer) => {
          let res: AnswerMin;
          if(answer.question.type_question === 'SA'){
            res = {
              text: answer.question.text,
              value: answer.answer_text
            }
          }else{
            res = {
              text: answer.question.text,
              value: answer.answer_option.text
            }
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
