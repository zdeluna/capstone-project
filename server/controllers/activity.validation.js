const { check, validationResult } = require("express-validator/check");

exports.createActivity = [
  check("description").optional(),
  check("type")
    .exists()
    .withMessage("MUST_CONTAIN_TYPE"),
  check("date")
    .custom((dateValue, { req }) => {
      // Check to make sure it is in MM_DD_YYYY format
      if (!dateValue.match(/^\d{2}-\d{2}-\d{4}$/)) return false;

      const date = new Date(dateValue);

      // Check to make sure date can be represented in milliseconds since 1970
      if (!date.getTime()) return false;

      // Change the date in milliseconds and change it to the MM_DD_YYYY format and compare it to the value that was passed in.
      return date.toISOString().slice(0, 10); // === dateValue;
    })
    .withMessage("DATE_MUST_BE_IN_MM-DD-YYYY"),
  check("measurement")
    .exists()
    .withMessage("MUST_CONTAIN_MEASUREMENT"),
  check("units")
    .exists()
    .withMessage("MUST_CONTAIN_UNITS"),
  check("value")
    .exists()
    .withMessage("MUST_CONTAIN_VALUE"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      return next();
    }
  }
];

exports.updateActivity = [
  check("description").optional(),
  check("type").optional(),
  check("date")
    .custom((dateValue, { req }) => {
      // Check to make sure it is in MM_DD_YYYY format
      if (!dateValue.match(/^\d{2}-\d{2}-\d{4}$/)) return false;

      const date = new Date(dateValue);

      // Check to make sure date can be represented in milliseconds since 1970
      if (!date.getTime()) return false;

      // Change the date in milliseconds and change it to the MM_DD_YYYY format and compare it to the value that was passed in.
      return date.toISOString().slice(0, 10); // === dateValue;
    })
    .optional()
    .withMessage("DATE_MUST_BE_IN_MM-DD-YYYY"),
  check("measurement").optional(),
  check("units").optional(),
  check("value").optional(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      return next();
    }
  }
];
