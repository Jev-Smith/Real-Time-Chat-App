import { createWelcomeEmailTemplate } from '../emails/emailTemplates.js';
import { sender } from '../lib/resend.js';
import { resendClient } from '../lib/resend.js';

export const sendWelcomeEmail = async (name, email, clientURL) => {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: 'Welcome to Chatty',
        html: createWelcomeEmailTemplate(name, clientURL)
    });

    if (error) {
        return console.error("Error while sending email from resend.js", { error });
    }

    console.log("Welcome email sent successfully", { data });
};
