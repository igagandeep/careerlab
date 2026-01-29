export const validateRequest = schema => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = {};

      // Convert Zod errors to field-specific format
      if (result.error && result.error.issues) {
        result.error.issues.forEach(err => {
          const field = err.path[0];
          if (field) {
            errors[field] = err.message;
          }
        });
      }

      return res.status(400).json({ errors });
    }

    next();
  };
};
