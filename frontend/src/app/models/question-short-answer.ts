import { Question } from "./question";
export class QuestionShortAnswer extends Question{
    resourcetype: string = 'QuestionShortAnswer';

    constructor(obj: QuestionShortAnswer){
        super(obj);
        this.resourcetype = 'QuestionShortAnswer';
    }
  
}
