import { ResponseError } from "../error/response-error.js";

const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .json({
        errors: err.message,
      })
      .end();
  } else if (err.kind === "ObjectId") {
    res.status(404).json({
      errors: "ObjectId is not valid or not found",
    });
  } else {
    res
      .status(500)
      .json({
        errors: err.message,
      })
      .end();
  }
};

export { errorMiddleware };
