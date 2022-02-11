import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AnswerMultipleChoice } from 'src/app/models/answer-multiple-choice';
import { AnswerRange } from 'src/app/models/answer-range';
import { AnswerShortAnswer } from 'src/app/models/answer-short-answer';
import { ReportAnswer } from 'src/app/models/report-answer';
import { ReportAnswerService } from 'src/app/services/report-answer.service';



@Component({
  selector: 'app-answer-view-group',
  templateUrl: './answer-view-group.component.html',
  styleUrls: ['./answer-view-group.component.scss']
})
export class AnswerViewGroupComponent implements OnInit {

  groupAnswers = {}
  chartOptions = {}

  constructor(
    private reportAnswerService: ReportAnswerService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    let idQuiz: number = +this.route.snapshot.paramMap.get('id');
    this.reportAnswerService.getReportAnswerByQuiz(idQuiz).subscribe(

      (reportAnwsers: ReportAnswer[]) => {
        reportAnwsers.map(r => {
          r.answers.map(a => {
            this.groupAnswers[a.question.id] = {
              question: a.question.text,
              type: a.question.type_question,
              answers: (this.groupAnswers[a.question.id]?.answers) ? this.groupAnswers[a.question.id].answers : []
            }

            switch (a.question.type_question) {
              case 'SA':
                let aux = a as AnswerShortAnswer;
                this.groupAnswers[a.question.id].answers.push(aux.value)
                break;
              case 'MCQ':
                let aux2 = a as AnswerMultipleChoice;
                let existOptiont = this.groupAnswers[aux2.question.id]?.answers.filter(o => o.id === aux2.answer_option.id).length > 0
                if(!existOptiont){
                  this.groupAnswers[a.question.id].answers.push({
                    id: aux2.answer_option.id,
                    text: aux2.answer_option.text,
                    count: 1
                  })
                }else{
                  this.groupAnswers[a.question.id].answers.filter(o => o.id == aux2.answer_option.id).map(o => o.count++)
                }

                break;

              case 'RQ':
                let aux3 = a as AnswerRange;
                let exist = this.groupAnswers[aux3.question.id]?.answers.filter(o => o.id === aux3.value).length > 0
                if(!exist){
                  this.groupAnswers[a.question.id].answers.push({
                    id: aux3.value,
                    text: aux3.value,
                    count: 1
                  })
                }else{
                  this.groupAnswers[a.question.id].answers.filter(o => o.id == aux3.value).map(o => o.count++)
                }

                break;

            }

          })
        })

        for(let questionId in this.groupAnswers){
          switch (this.groupAnswers[questionId].type) {
            case 'MCQ':
              this.chartOptions[questionId] = this.getBarChartData(+questionId)
              break;
            case 'RQ':
              this.chartOptions[questionId] = this.getBarChartData(+questionId)
              break;
          }
        }

        console.log(this.chartOptions)
       
      },
      () => {
        this.toastr.error("Error al obtener las respuestas");
      }
    );
  }


  getBarChartData(questionId: number): any {



    let options = {
      series: [
        {
          name: "Respuestas",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: "Grafico de barras"
      },
      xaxis: {
        categories: []
      }
    };

    this.groupAnswers[questionId].answers.map(a => {
      options.series[0].data.push(+a.count)
      options.xaxis.categories.push("" + a.text)
    })

    return options;
    
  }

}
