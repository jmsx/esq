import { Answer } from "./answer";

export class ReportAnswer {
    id?: number;
    user: number;
    quiz: number;
    answers: Answer[];
}
