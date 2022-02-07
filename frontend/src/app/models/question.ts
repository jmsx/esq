import { Option } from "./option";


export class Question {
    id: number;
    text: string;
    type_question: string;
    quiz?: number;
    options: Option[];
}
