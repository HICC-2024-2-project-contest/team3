import nodemailer from "nodemailer";

const smtpSettings = {
    "gmail.com": { host: "smtp.gmail.com", port: 587, secure: false },
    "protonmail.com": { host: "smtp.protonmail.com", port: 587, secure: false },
    // Add email domain
};

async function sendMail({ toEmail, subject, htmlContent }) {
    if (!toEmail) {
        throw new Error("Recipient email is required.");
    }

    const emailDomain = process.env.EMAIL_USER.split("@")[1];
    const smtpConfig = smtpSettings[emailDomain];

    if (!smtpConfig) {
        throw new Error(`Unsupported email domain: ${emailDomain}`);
    }

    const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.secure,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: subject,
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return info.response;
    } catch (error) {
        throw new Error(`Failed to send email: ${error.message}`);
    }
}

export default sendMail;
