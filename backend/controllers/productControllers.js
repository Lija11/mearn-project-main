const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");

// create product---admin

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// exports.getAllProducts = async (req, res) => {
//     try {
//       const apiFeature = new ApiFeatures(Product.find(), req.query).search();
//       let products = await apiFeature.query;
//       res.status(200).json({
//         success: true,
//         products,
//       });
//     } catch (error) {
//       res.status(500).send(error.message);
//     }
//   };

// getAllProducts

exports.getAllProducts = async (req, res) => {
  try {
    const resultPerPage = 5;
    const currentPage = Number(req.query.page || "1");
    const skip = resultPerPage * (currentPage - 1);
    const productCount = await Product.countDocuments();
    let filter = {};
    if (req.query.categories) {
      filter = {
        category: req.query.categories.split(","),
      };
    }

    const products = await Product.find(filter)
      .populate("category")
      .limit(resultPerPage)
      .skip(skip);
    res.status(200).json({
      success: true,
      products,
      productCount,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getOneProducts = async (req, res) => {
  try {
    let product = await Product.find({
      $or: [
        {
          name: {
            $regex: req.params.key,
          },
        },
      ],
    });
    console.log(product);
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// getProductDetails

exports.getProductDetails = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(500).json({
        success: true,
        messages: "product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// updateProduct

// exports.updateProduct = async (req, res, next) => {
//   try {
//     let product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(500).json({
//         success: false,
//         message: "product not found",
//       });
//     }

//     product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//       useFindAndModify: false,
//     });

//     res.status(200).json({
//       success: true,
//       product,
//     });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    // return res.status(500).json({
    //   success: false,
    //   message: "product not found",
    // });

    return ErrorHandler(res, 500, " new error check product not found");
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// deleteProduct

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(500).json({
        success: false,
        message: "product not found",
      });
    }

    await product.remove();
    res.status(200).json({
      success: true,
      message: "product deleted successfully",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// create product review and update review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  console.log(review, "reviewssssss");

  const product = await Product.findById(productId);
  console.log(product, "product");

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  console.log(isReviewed, "isReviewed");

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.comment = comment;
        rev.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  console.log(avg, "avg");

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// get All Reviews of a Product

exports.getAllProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "product not found",
    });
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// delete product review

exports.deleteProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
