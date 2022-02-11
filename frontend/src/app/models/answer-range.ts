import { Answer } from "./answer";

export class AnswerRange extends Answer {
    value: number;
    resourcetype?: string;
    constructor(obj: AnswerRange) {
        super(obj);
        this.value = obj.value;
        this.resourcetype = 'AnswerRange';
    }
}
