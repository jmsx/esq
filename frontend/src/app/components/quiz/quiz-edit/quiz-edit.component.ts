import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OptionQuestionMultipleChoice } from 'src/app/models/option-question-multiple-choice';
import { Question } from 'src/app/models/question';
import { QuestionMultipleChoice } from 'src/app/models/question-multiple-choice';
import { QuestionRange } from 'src/app/models/question-range';
import { QuestionShortAnswer } from 'src/app/models/question-short-answer';
import { Quiz } from 'src/app/models/quiz';
import { User } from 'src/app/models/user.model';
import { QuizService } from 'src/app/services/quiz.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-quiz-edit',
  templateUrl: './quiz-edit.component.html',
  styleUrls: ['./quiz-edit.component.scss']
})
export class QuizEditComponent implements OnInit {

  quiz: Quiz;
  formQuiz: FormGroup;
  user: User;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private toastr: ToastrService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    
    this.userService.getMyUser().subscribe(
      (user: User) => {
        this.user = user;
        this.initQuiz();
      }
    );

  }
  initQuiz(){
    let id: number = +this.route.snapshot.paramMap.get('id');
    if (id != 0) {
      this.quizService.getQuiz(id).subscribe(
        (quiz: Quiz) => {
          this.quiz = quiz;
          this.generateFormQuiz()
        }
      );
    }else{
      this.quiz = {
        id: undefined,
        name: '',
        questions: [],
        owner: this.user.id,
        description: '',
      };
      this.generateFormQuiz();
    }
  }

  // This generat a for each question in the quiz
  generateFormQuiz() {
    console.log(this.quiz);
    let questions = new FormArray([]);
    this.quiz.questions.forEach((question: (QuestionMultipleChoice | QuestionShortAnswer | QuestionRange)) => {
      let questionForm =  new FormGroup({
        text: new FormControl(question.text, Validators.required),
        type_question: new FormControl(question.type_question, Validators.required),
      })

      switch(question.type_question){
        case 'MCQ':
          let options = new FormArray([]);
          let questionMCQ =  new QuestionMultipleChoice(question as QuestionMultipleChoice);
          questionMCQ.options.forEach((option: OptionQuestionMultipleChoice) => {
            let optionForm = new FormGroup({
              id: new FormControl(option.id),
              text: new FormControl(option.text, Validators.required),
            })
            if(option.id){
              optionForm.addControl('id', new FormControl(option.id));
            }
            options.push(optionForm)
          })
          questionForm.addControl('options', options);
          break;

        case 'SA':
          break;

        case 'RQ':
          let questionRQ = new QuestionRange(question as QuestionRange);
          questionForm.addControl('min', new FormControl(questionRQ.min));
          questionForm.addControl('max', new FormControl(questionRQ.max));
          break;
      }

      if(question.id){
        questionForm.addControl('id', new FormControl(question.id));
      }
      
      questions.push(questionForm);
    })


    this.formQuiz = new FormGroup({
      name: new FormControl(this.quiz.name, Validators.required),
      description:new FormControl(this.quiz.description, Validators.required),
      questions: questions,
    });

    console.log(this.formQuiz);


  }

  saveQuiz(){
    // Get Formdata and parse to quiz object
    this.quiz.name = this.formQuiz.get('name').value;
    this.quiz.description = this.formQuiz.get('description').value;
    this.quiz.questions = [];
    this.quiz.owner = this.user.id;

    // Parse questions
    this.formQuiz.get('questions').value.forEach(
      (question: (QuestionMultipleChoice | QuestionShortAnswer | QuestionRange)) => {   
        let questionForm;  
        switch(question.type_question){
          case 'MCQ':
            questionForm = this.generateQuestionMCQ(question as QuestionMultipleChoice);
            break;
          case 'SA':
            questionForm = this.generateQuestionSA(question as QuestionShortAnswer);
            break;
          case 'RQ':
            questionForm = this.generateQuestionRQ(question as QuestionRange);
            break;
        }   
        
        this.quiz.questions.push(questionForm);
      })


    // Save or update quiz
    if (this.quiz.id) {
      this.quizService.updateQuiz(this.quiz).subscribe(
        (quiz: Quiz) => {
          this.quiz = quiz;
          this.toastr.success('Quiz updated successfully');
        },
        (error) => {
          this.toastr.error('Error updating quiz');
          console.log(error);
        } 
      );
    }else{
      this.quizService.createQuiz(this.quiz).subscribe(
        (quiz: Quiz) => {
          this.quiz = quiz;
          this.toastr.success('Quiz created successfully');
        },
        (error) => {
          this.toastr.error('Error creating quiz');
          console.log(error);
        }
      );
    }
  }

  addOption(idx, i){
    (<FormArray>(<FormArray>this.formQuiz.get('questions')).at(idx).get('options')).push(new FormGroup({
      id: new FormControl(null),
      text: new FormControl('', Validators.required),
    }))
  }

  removeQuestion(idx){
    (<FormArray>this.formQuiz.get('questions')).removeAt(idx);
  }
  
  addQuestion(){
    (<FormArray>this.formQuiz.get('questions')).push(new FormGroup({
      id: new FormControl(null),
      text: new FormControl('', Validators.required),
      type_question: new FormControl('', Validators.required),
      options: new FormArray([]),
      min: new FormControl(null, Validators.required),
      max: new FormControl(null, Validators.required),
    }))
  }

  generateQuestionMCQ(question: QuestionMultipleChoice): OptionQuestionMultipleChoice{
    let questionForm = {} as QuestionMultipleChoice;

    if(question.id){
      questionForm.id = question.id;
    }

    questionForm.text = question.text;
    questionForm.type_question = question.type_question;
    questionForm.options = [];

    question.options.forEach((option: OptionQuestionMultipleChoice) => {
      let optionForm = {} as OptionQuestionMultipleChoice;
      if(option.id){
        optionForm.id = option.id;
      } 
      optionForm.text = option.text;
      questionForm.options.push(optionForm);
    })

    return new QuestionMultipleChoice(questionForm);
  }

  generateQuestionSA(question: QuestionShortAnswer): QuestionShortAnswer{
    let questionForm = {} as QuestionShortAnswer;
    if(question.id){
      questionForm.id = question.id;
    }
    questionForm.text = question.text;
    questionForm.type_question = question.type_question;
    return new QuestionShortAnswer(questionForm);
  }

  generateQuestionRQ(question: QuestionRange): QuestionRange{
    let questionForm = {} as QuestionRange;
    if(question.id){
      questionForm.id = question.id;
    }
    questionForm.text = question.text;
    questionForm.type_question = question.type_question;
    questionForm.min = question.min;
    questionForm.max = question.max;
    return new QuestionRange(questionForm);
  }


}
