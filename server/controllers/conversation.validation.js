const { check, validationResult } = require("express-validator/check");

exports.createConversation = [
  check("recipient")
    .exists()
    .withMessage("MUST_MUST_HAVE_RECIPIENT"),
  check("content")
    .exists()
    .withMessage("MUST_HAVE_CONTENT"),

  // Determine if there were errors in the request and then store them in the errors object
  // Consulted https://express-validator.github.io/docs/
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      return next();
    }
  }
];
