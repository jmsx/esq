import { OptionQuestionMultipleChoice } from "./option-question-multiple-choice";
import { Question } from "./question";

export class QuestionMultipleChoice extends Question {
    options: OptionQuestionMultipleChoice[];
    multiple: boolean;
    resourcetype: string = 'QuestionMultipleChoice';

    constructor(obj: QuestionMultipleChoice) {
        super(obj);
        this.options = obj.options;
        this.multiple = obj.multiple;
    }

}
