import { Answer } from "./answer";
import { OptionQuestionMultipleChoice } from "./option-question-multiple-choice";

export class AnswerMultipleChoice extends Answer {
    answer_option: OptionQuestionMultipleChoice;
    resourcetype?: string;
    constructor(obj: AnswerMultipleChoice) {
        super(obj);
        this.answer_option = obj.answer_option;
        this.resourcetype = 'AnswerMultipleChoice';

    }

}
