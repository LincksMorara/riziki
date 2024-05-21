// Load environment variables from .env file
require('dotenv').config();

// Import the nodemailer module
const nodemailer = require('nodemailer');

// Define the sendEmail function
const sendEmail = async (options) => {
    // Create a transporter object using the createTransport method of nodemailer
    // This object is configured with your SMTP settings
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // Host for the SMTP service as defined in your .env file
        port: process.env.EMAIL_PORT, // Port for the SMTP service as defined in your .env file
        auth: {
            user: process.env.EMAIL_USERNAME, // Username for the SMTP service as defined in your .env file
            pass: process.env.EMAIL_PASSWORD, // Password for the SMTP service as defined in your .env file
        },
    });

    // Define the mail options
    const mailOptions = {
        from: process.env.EMAIL_FROM, // Sender's email address as defined in your .env file
        to: options.to, // Recipient's email address
        subject: options.subject, // Subject of the email
        text: options.text, // Plain text body of the email
    };

    // Use the sendMail method of the transporter object to send the email with the defined options
    await transporter.sendMail(mailOptions);
};

// Export the sendEmail function
module.exports = sendEmail;