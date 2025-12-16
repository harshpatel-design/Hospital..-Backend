/**
 * Validates request body against a Joi schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
export const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });

  if (error) {
    const details = error.details.map(d => d.message);
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: details
    });
  }

  // Replace req.body with the validated and sanitized value
  req.body = value;
  next();
};

/**
 * Validates query parameters against a Joi schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
export const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
  });

  if (error) {
    const details = error.details.map(d => d.message);
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      errors: details
    });
  }

  // Replace req.query with the validated and sanitized value
  req.query = value;
  next();
};

/**
 * Validates request parameters against a Joi schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
export const validateParams = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.params, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });

  if (error) {
    const details = error.details.map(d => d.message);
    return res.status(400).json({
      success: false,
      message: "Invalid URL parameters",
      errors: details
    });
  }

  // Replace req.params with the validated and sanitized value
  req.params = value;
  next();
};

// Default export for backward compatibility
export default (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.details.map((d) => d.message),
    });
  }

  next();
};