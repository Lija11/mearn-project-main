// // const jwt = require("jsonwebtoken");
// // const User = require("../models/userModel");

// // exports.isAuthenticatedUser = async (req, res, next) => {
// //   try {
// //     const { token } = req.cookies;
// //     if (!token) {
// //       return res.status(500).json({
// //         success: false,
// //         message: "Please Login to access this resource",
// //       });
// //     }
// //     // if (!token) {
// //     //   //   return next(new ErrorHander("Please Login to access this resource", 401));
// //     //   return next(new Error("Parameter is not a number!"), 401);
// //     // }
// //     const decodedData = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = await User.findById(decodedData.id);
// //     next();
// //   } catch (error) {
// //     res.status(500).send(error.message);
// //   }
// // };

// // authorize Roles

// exports.authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: true,
//         message: `Role: ${req.user.role} is not allowed to access this resource `,
//       });
//       // return next(
//       //   new ErrorHander(
//       //     `Role: ${req.user.role} is not allowed to access this resouce `,
//       //     403
//       //   )
//       // );
//     }

//     next();
//   };
// };

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});

// ===authorizeRoles

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource `,
          403
        )
      );
    }

    next();
  };
};
