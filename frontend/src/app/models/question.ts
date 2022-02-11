export class Question {
    id?: number;
    type_question: string;
    text: string;

    constructor(obj: Question) {
        Object.assign(this, obj);
    }
}
