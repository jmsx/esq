import { Answer } from "./answer";

export class AnswerShortAnswer extends Answer {
    value: string;
    resourcetype?: string;
    constructor(obj: AnswerShortAnswer) {
        super(obj);
        this.value = obj.value;
        this.resourcetype = 'AnswerShortAnswer';
    }
}

