const { check, validationResult } = require("express-validator/check");

exports.addParticipant = [
  check("status")
    .exists()
    .withMessage("TO_ADD_A_PARTICIPANT_A_STATUS_CODE_MUST_BE_SENT"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      return next();
    }
  }
];

exports.createChallenge = [
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
    .withMessage("START_DATE_MUST_BE_IN_MM-DD-YYYY"),
  check("activity").exists(),
  check("measurement").exists(),
  check("duration").exists(),

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

exports.createMessage = [
  check("content")
    .exists()
    .withMessage("MESSAGE_CONTENT_BODY_PARAMETER_MUST_NOT_BE_EMPTY"),
  check("reply").optional(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      return next();
    }
  }
];

exports.updateMessage = [
  check("content").optional(),
  check("reply").optional(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      return next();
    }
  }
];

exports.updateChallenge = [
  check("name").optional(),
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
    .optional()
    .withMessage("START_DATE_MUST_BE_IN_MM-DD-YYYY"),
  check("activity").optional(),
  check("measurement").optional(),
  check("duration").optional(),

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
  check("total")
    .exists()
    .withMessage("MUST_CONTAIN_BODY_PARAMETER_TOTAL"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      return next();
    }
  }
];
