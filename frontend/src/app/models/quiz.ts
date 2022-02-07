import { Question } from "./question";

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
    questions: Question[];
}
