export interface TemplateResult {
    subject: string;
    html: string;
    text: string;
}
export declare const verifyEmailTemplate: (data: {
    name: string;
    url: string;
    token: string;
}) => TemplateResult;
