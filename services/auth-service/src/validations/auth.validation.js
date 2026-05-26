const { z } = require('zod');

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map(i => ({ field: i.path.join('.'), message: i.message }));
    return res.status(400).json({ success: false, message: 'Validation error', errors });
  }
  req.body = result.data;
  next();
};

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number').optional(),
  role: z.enum(['customer', 'restaurant_owner']).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema)
};
