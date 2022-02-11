import { Question } from "./question";
import { QuestionMultipleChoice } from "./question-multiple-choice";
import { QuestionRange } from "./question-range";
import { QuestionShortAnswer } from "./question-short-answer";

export class Quiz {
    id: number;
    name: string;
    description: string;
    date_created?: Date;
    date_updated?: Date;
    date_published?: Date;
    is_published?: boolean;
    is_archived?: boolean;
    is_locked?: boolean;
    is_deleted?: boolean;
    owner: number;
    shares?: any[];
    questions: (
        QuestionMultipleChoice |
        QuestionShortAnswer |
        QuestionRange
    )[];
}
