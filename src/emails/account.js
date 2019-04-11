const sgMail = require('@sendgrid/mail');

//task-manager-node-app
//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
const SENDGRID_API_KEY=process.env.SENDGRID_API_KEY;


sgMail.setApiKey(SENDGRID_API_KEY);

const sendWelcomeEmail=(email,name)=>{
    let msg = {
        to: email,
        from: 'angelowilliamsalex@gmail.com',
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: `<strong>and easy to do anywhere, even with Node.js</strong>`,
      };

      sgMail.send(msg);
}

const sendAccountCancellationEmail=(email,name)=>{
    let msg = {
        to: email,
        from: 'angelowilliamsalex@gmail.com',
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: `<strong>and easy to do anywhere, even with Node.js</strong>`,
      };

      sgMail.send(msg);
}

module.exports={
    sendWelcomeEmail,
    sendAccountCancellationEmail
}
