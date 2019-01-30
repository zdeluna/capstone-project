const { check, validationResult } = require("express-validator/check");

exports.update = [
  check("password")
    .isLength({ min: 6 })
    .withMessage("PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS")
    .optional(),
  check("username")
    .isEmail()
    .withMessage("EMAIL_IS_NOT_VALID")
    .optional(),
  check("first_name").optional(),
  check("last_name").optional(),

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
