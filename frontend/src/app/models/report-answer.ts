import { Answer } from "./answer";
import { AnswerMultipleChoice } from "./answer-multiple-choice";

export class ReportAnswer {
    id?: number;
    user: number;
    quiz: number;
    answers: Answer[];
}
