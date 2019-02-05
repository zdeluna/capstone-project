const { check, validationResult } = require("express-validator/check");

exports.create = [
  check("name")
    .exists()
    .withMessage("CHALLENGE_MUST_HAVE_NAME"),
  check("start_date")
    /* Check date to make sure it is in the MM_DD_YYYY format
	 Consulted https://stackoverflow.com/questions/47056283/typeerror-req-checkbody-optional-isdate-is-not-a-function */
    .custom((dateValue, { req }) => {
      // Check to make sure it is in MM_DD_YYYY format
      if (!dateValue.match(/^\d{2}-\d{2}-\d{4}$/)) return false;

      const date = new Date(dateValue);

      // Check to make sure date can be represented in milliseconds since 1970
      if (!date.getTime()) return false;

      // Change the date in milliseconds and change it to the MM_DD_YYYY format and compare it to the value that was passed in.
      return date.toISOString().slice(0, 10); // === dateValue;
    })
    .withMessage("START_DATE_MUST_BE_IN_MM_DD_YYYY"),
  check("activity").exists(),
  check("measurement").exists(),
  check("duration").exists(),
  check("participants").optional(),

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
