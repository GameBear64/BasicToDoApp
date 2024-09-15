const joi = require('joi');

exports.joiValidate =
  (schema, realm = 'body') =>
  (req, res, next) => {
    let validation = joi.object(schema).validate(req[realm]);
    if (validation.error) return res.status(400).json(validation.error.details[0].message);

    next();
  };
