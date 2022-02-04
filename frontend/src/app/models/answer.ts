import { Option } from "./option";
import { Question } from "./question";

export class Answer {
    id?: number;
    question: Question;
    answer_option?: Option;
    answer_text?: string;
    report_answer?: number;
}
