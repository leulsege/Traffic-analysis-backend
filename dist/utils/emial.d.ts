interface EmailOptions {
    email: string;
    subject: string;
    message: string;
}
declare const sendEmail: (options: EmailOptions) => Promise<void>;
export default sendEmail;
