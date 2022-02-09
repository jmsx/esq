import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Option } from 'src/app/models/option';
import { Question } from 'src/app/models/question';
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
    this.quiz.questions.forEach((question: Question) => {
      let questionForm =  new FormGroup({
          text: new FormControl(question.text, Validators.required),
          type_question: new FormControl(question.type_question, Validators.required),
        })
      let options = new FormArray([]);

      question.options.forEach((option: Option) => {
        let optionForm = new FormGroup({
          id: new FormControl(option.id),
          text: new FormControl(option.text, Validators.required),
        })
        if(option.id){
          optionForm.addControl('id', new FormControl(option.id));
        }
        options.push(optionForm)
      })

      if(question.id){
        questionForm.addControl('id', new FormControl(question.id));
      }
      questionForm.addControl('options', options);
      questions.push(questionForm);
    })

    this.formQuiz = new FormGroup({
      name: new FormControl(this.quiz.name, Validators.required),
      description:new FormControl(this.quiz.description, Validators.required),
      questions: questions,
    });

    console.log(this.formQuiz);

    console.log(this.formQuiz);


  }

  saveQuiz(){
    this.quiz.name = this.formQuiz.get('name').value;
    this.quiz.description = this.formQuiz.get('description').value;
    this.quiz.questions = [];
    this.quiz.owner = this.user.id;
    this.formQuiz.get('questions').value.forEach((question: Question) => {
      let questionForm = new Question();
      if(question.id){
        questionForm.id = question.id;
      } 
      questionForm.text = question.text;
      questionForm.type_question = question.type_question;
      questionForm.options = [];
      question.options.forEach((option: Option) => {
        let optionForm = new Option();
        if(option.id){
          optionForm.id = option.id;
        } 
        optionForm.text = option.text;
        questionForm.options.push(optionForm);
      })
      this.quiz.questions.push(questionForm);
    })
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
      options: new FormArray([])
    }))
  }

}
