import { Question } from "./question";

export class Answer {
    id?: number;
    question: Question;
    
    constructor(obj: Answer) {
        Object.assign(this, obj);
    }
}
