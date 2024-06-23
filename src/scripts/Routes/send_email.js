const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const crypto = require('crypto');
const { sendFile, sendError, sendHTML } = require('../utils');
const Route = require("../route");
const bcrypt = require('bcryptjs');
const { getUserByEmail, storeResetToken, updatePassword, verifyTokenAndGetUserFromTable } = require('../users');


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 465,
    service: 'gmail',
    secure: true, // uses TLS
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error verifying transporter:', error);
    } else {
        console.log('Transporter ready to send emails');
    }
});

const forgotPostRoute = new Route('/forgot-pass', 'POST', async (req, res) => {
  const { email } = req.body;

//   const user = await getUserByEmail(email);
//   if (!user) {
//     sendError(res, 404, 'User with this email does not exist');
//     return;
//   }

  getUserByEmail(email, async (error, user) => {
    if (error) {
        console.error('Error fetching user:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    } else if (!user) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid credentials' }));
    } else {
        try {
            // reset token
            const token = (await crypto.randomBytes(32)).toString('hex');

            await storeResetToken(user.user_id, token);

            const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

            await transporter.sendMail({
            from: 'BooServices@gmail.com',
            to: email,
            subject: 'Password Reset Request',
            html: `Click <a href="${resetUrl}">here</a> to reset your password.`,
            });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Password reset email sent. Check your inbox.' }));
        } catch (error) {
            console.error('Error sending password reset email:', error);
            sendError(res, 500, 'Internal server error');
        }
       }
    })
});

const resetGetRoute = new Route('/reset-password', 'GET', async (req, res) => {
    const token  = req.url.split('?')[1].split('&').find(p => p.trim().startsWith('token=')).split('=')[1];

    try {
        const user = await verifyTokenAndGetUserFromTable(token);
        if (!user) {
            sendError(res, 400, 'Invalid or expired token');
            return;
        }

        sendFile('./Pages/reset_pass.html', res);
    } catch (error) {
        console.error('Error verifying reset token:', error);
        sendError(res, 500, 'Internal server error');
    }
});


const resetPostRoute = new Route('/reset-password', 'POST', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await verifyTokenAndGetUserFromTable(token);
        if (!user) {
            sendError(res, 400, 'Invalid or expired token');
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await updatePassword(user.email, hashedPassword);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Password reset successful.' }));
    } catch (error) {
        console.error('Error resetting password:', error);
        sendError(res, 500, 'Internal server error');
    }
});


const contactPostRoute = new Route('/contact', 'POST', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        sendError(res, 400, 'All fields are required');
        return;
    }

    try {
        await transporter.sendMail({
            from: email,
            to: 'stefan.cafe16@gmail.com',
            subject: 'Contact Form Submission',
            html: `<p><strong>Name:</strong> ${name}</p>
                   <p><strong>Email:</strong> ${email}</p>
                   <p><strong>Message:</strong> ${message}</p>`,
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Your message has been sent successfully.' }));
    } catch (error) {
        console.error('Error sending contact form email:', error);
        sendError(res, 500, 'Internal server error');
    }
});

module.exports = {
    forgotPostRoute,
    contactPostRoute,
    resetGetRoute,
    resetPostRoute
};