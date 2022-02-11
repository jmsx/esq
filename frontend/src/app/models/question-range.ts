import { Question } from "./question";

export class QuestionRange extends Question{
    resourcetype: string = "QuestionRange";
    min?: number;
    max?: number;

    constructor(obj: QuestionRange){
        super(obj);
        this.min = obj.min;
        this.max = obj.max;
    }
}
