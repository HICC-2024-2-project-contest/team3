const nodemailer = require("nodemailer");

const smtpSettings = {
    'gmail.com': { host: 'smtp.gmail.com', port: 587, secure: false }
    // Add email domain and settings here
};

async function sendMail({ email, password, toEmail, subject, htmlContent}) {
    const emailDomain = email.split('@')[1];
    const stmpConfig = smtpSettings[emailDomain];
    if (!stmpConfig) {
        throw new Error(`Unsupported email domain: ${emailDomain}`);
    }
    const transporter = nodemailer.createTransport({
        host: stmpConfig.host,
        port: stmpConfig.port,
        secure: stmpConfig.secure,
        auth: {
            user: email,
            pass: password
        }
    });

    const mailOptions = {
        from: email,
        to: toEmail,
        subject: subject,
        html: htmlContent
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return info.response;
    } catch (error) {
        throw new Error(`Failed to send email: ${error.message}`);
    }
}

module.exports = { sendMail };