export interface ParsedQuestion {
    assessment_question_id?: string | number;
    question: string;
    option_a?: string;
    option_b?: string;
    option_c?: string;
    option_d?: string;
    correct_option?: string;
    // [key: string]: any;
}