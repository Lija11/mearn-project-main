exports.forgogtPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (user) {
      const randomString = randomstring.generate();
      const resetToken = User.updateOne(
        { email: email },
        { $set: { resetPasswordToken: randomstring } }
      );
      sendEmail(user.name, user.email, randomString);
      res.status(200).send({
        success: true,
        message: "Please check your inbox of mail and reset your password",
      });
    } else {
      res.status(200).send({ success: true, message: "user not found" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(401).json({ status: 401, message: "Enter Your Email" });
  }

  try {
    const userFind = await User.findOne({ email: email });

    // token generate for reset password
    // const token = jwt.sign({_id:userFind._id},keysecret,{
    //     expiresIn:"120s"
    // });
    const token = getJWTToken();

    const setusertoken = await User.findByIdAndUpdate(
      { _id: userFind._id },
      { verifyToken: token },
      { new: true }
    );

    if (setusertoken) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Sending Email For password Reset",
        text: `This Link Valid For 2 MINUTES http://localhost:3001/forgotpassword/${userfind.id}/${setusertoken.verifytoken}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error", error);
          res.status(401).json({ status: 401, message: "email not send" });
        } else {
          console.log("Email sent", info.response);
          res
            .status(201)
            .json({ status: 201, message: "Email sent Succsfully" });
        }
      });
    }
  } catch (error) {
    res.status(401).json({ status: 401, message: "invalid user" });
  }
};

// exports.resetPassword = async (req, res) => {
//   try {
//     const token = req.query.token;
//     const resetPassword = await User.findOne({
//       token: token,
//     });
//     if (resetPassword) {
//       const password = req.body.password;
//       const newPassword = await resetPassword.comparePassword(password);
//       const userData = await User.findByIdAndUpdate(
//         { _id: resetPassword._id },
//         { $set: { password: newPassword, token: "" } },
//         { new: true }
//       );
//       res.status(200).send({
//         success: true,
//         message: "Password Reset Successfully",
//         data: userData,
//       });
//     } else {
//       res
//         .status(200)
//         .send({ success: false, message: "this link has been expire" });
//     }
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

// // // Reset Password

// exports.resetPasssword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const resetPassword = await User.findOne({
//       token: token,
//     });
//     if (resetPassword) {
//       const { password, confirmPassword } = req.body;
//       if (password === confirmPassword) {
//         res
//           .status(200)
//           .send({ success: true, message: "password updated successfully" });
//       } else {
//         res
//           .status(404)
//           .send({ success: true, message: "password does not matched" });
//       }
//     } else {
//       res
//         .status(200)
//         .send({ success: false, message: "this link has been expire" });
//     }
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

// verify user for forgot password time
exports.resetPasssword = async (req, res) => {
  const { token } = req.params;
  try {
    const validuser = await User.findOne({ verifytoken: token });
    // console.log(validuser);

    const verifyToken = jwt.verify(token);
    // console.log(verifyToken);

    console.log(verifyToken);

    if (validuser && verifyToken._id) {
      res.status(201).json({ status: 201, validuser, message: "user valid" });
    } else {
      res.status(401).json({ status: 401, message: "user not exist" });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
};

// // Forgot Password

// // exports.forgotPassword = async (req, res, next) => {
// //   const user = await User.findOne({ email: req.body.email });
// //   if (!user) {
// //     return res.status(404).json({
// //       success: false,
// //       message: "user not found",
// //     });
// //   }

// //   // get resetPasswordToken

// //   const resetToken = user.getResetPasswordToken();
// //   console.log(resetToken, "jhugf");
// //   await user.save({ validateBeforeSave: false });
// //   const resetPasswordUrl = `${req.protocol}://${req.get(
// //     "host"
// //   )}/password/reset/${resetToken}`;
// //   const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested
// //       this email then, please ignore it.`;
// //   console.log(resetPasswordUrl, message, "msb");
// //   try {
// //     await sendEmail({
// //       email: user.email,
// //       subject: "Ecommerce Password Recovery",
// //       message,
// //     });
// //     res.status(200).json({
// //       success: true,
// //       message: `Email sent to ${user.email} successfully`,
// //     });
// //   } catch (error) {
// //     user.resetPasswordToken = undefined;
// //     user.resetPasswordExpire = undefined;
// //     await user.save({ validateBeforeSave: false });
// //     res.status(500).send(error.message);
// //     console.log(error, "vbgnh");
// //   }
// // };

// // rest password

// exports.resetPaassword = async (req, res) => {
//   try {
//     const resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(req.params.token)
//       .digest("hex");
//     const user = User.findOne({
//       resetPasswordToken,
//       resetPasswordExpire: { $gt: Date.now() },
//     });
//     if (!user) {
//       return "reset password token is invalid or has been expired", 404;
//     }

//     // if (req.body.password !== require.body.confirmPassword) {
//     //   return "Password doesn't matched", 404;
//     // }
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(user, "forrr");

  if (!user) {
    return next(new error("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();
  console.log(resetToken, "resetToken");

  // await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new error(error.message, 500)());
  }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log(resetPasswordToken, "token");
  const user = await User.findOne({
    _id: resetPasswordToken._id,
    resetPasswordExpire: { $gt: Date.now() },
  });

  console.log(user, "userrr");
  try {
    if (!user) {
      // res.status(200).send({
      //   success: true,
      //   message: "Password rest success",
      // });
      res.send("invalid");
    }
    //       const userData = await User.findByIdAndUpdate(

    if (req.body.password !== req.body.confirmPassword) {
      // res.status(400).send({
      //   success: true,
      //   message: "Password does not password",
      // });
      res.send("not matched");
    }

    sendToken(user, 200, res);
  } catch (error) {
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
  }
};

// send email Link For reset Password
exports.forgotPassword = async (req, res) => {
  console.log(req.body);

  const { email } = req.body;

  if (!email) {
    res.status(401).json({ status: 401, message: "Enter Your Email" });
  }

  try {
    const userFind = await User.findOne({ email: email });
    console.log(userFind);

    // token generate for reset password
    const token = jwt.sign({ _id: userFind._id }, secretKey, {
      expiresIn: "120s",
    });

    const setusertoken = await User.findByIdAndUpdate(
      { _id: userFind._id },
      { resetPasswordToken: token },
      { new: true }
    );

    if (setusertoken) {
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Sending Email For password Reset",
        text: `This Link Valid For 2 MINUTES http://localhost:4000/password/forgot/reset/${userFind.id}/${setusertoken.resetPasswordToken}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error", error);
          res.status(401).json({ status: 401, message: "email not send" });
        } else {
          console.log("Email sent", info.response);
          res
            .status(201)
            .json({ status: 201, message: "Email sent Succsfully" });
        }
      });
    }
  } catch (error) {
    res.status(401).json({ status: 401, message: "invalid user" });
  }
};

// verify user for forgot password time
exports.resetPassword = async (req, res) => {
  const { id, token } = req.params;
  console.log(id, "id", "token", token);

  try {
    const validUser = await User.findOne({
      _id: id,
      resetPasswordToken: token,
    });

    const verifyToken = jwt.verify(token, secretKey);

    console.log(verifyToken);

    if (validUser && verifyToken._id) {
      res.status(201).json({ status: 201, validUser });
    } else {
      res.status(401).json({ status: 401, message: "user not exist" });
    }
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
};
