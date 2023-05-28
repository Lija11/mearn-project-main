// const nodeMailer = require("nodemailer");

//  const sendEmail = async (name, email, resetPasswordToken) => {
//   try {
//     const transporter = nodeMailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "lijasm32@gmail.com",
//         pass: "kzdqapmfjnttdqkc",
//       },
//     });

//     const mailOptions = {
//       from: "lijasm32@gmail.com",
//       to: email,
//       subject: "Ecommerce Password Recovery",
//       text: "That was easy!",
//       html:
//         "<p> Hi " +
//         name +
//         ', please copy the link <a href = "http://localhost:4000/api/v1/password/reset/' +
//         resetPasswordToken +
//         '">and reset your password</a></p>',
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("Email sent: " + info.response);
//       }
//     });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

// const sendEmail = async (option) => {
//   try {
//     const transporter = nodeMailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "lijasm32@gmail.com",
//         pass: "kzdqapmfjnttdqkc",
//       },
//     });

//     const mailOptions = {
//       from: "lijasm32@gmail.com",
//       to: option.email,
//       subject: option.subject,
//       text: option.message,
//       // html:
//       //   "<p> Hi " +
//       //   option +
//       //   ', please copy the link <a href = "http://localhost:4000/api/v1/password/reset/' +
//       //   resetPasswordToken +
//       //   '">and reset your password</a></p>',
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("Email sent: " + info.response);
//       }
//     });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

// module.exports = sendEmail;

const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
