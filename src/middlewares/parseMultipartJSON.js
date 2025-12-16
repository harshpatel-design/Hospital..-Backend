export const parseMultipartJSON = (fields = []) => {
  return (req, res, next) => {
    try {
      fields.forEach((field) => {
        if (
          req.body &&
          req.body[field] &&
          typeof req.body[field] === "string"
        ) {
          try {
            req.body[field] = JSON.parse(req.body[field]);
          } catch (err) {
            throw new Error(`Invalid JSON format for field: ${field}`);
          }
        }
      });

      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  };
};
