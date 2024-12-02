import Joi from "joi";

export const registerSchema = Joi.object({
  firstName: Joi.string()
    .max(50)
    .pattern(/^[a-zA-Z\s-]+$/)
    .required(),
  lastName: Joi.string()
    .max(50)
    .pattern(/^[a-zA-Z\s-]+$/)
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  budgetLimit: Joi.number().positive().required().messages({
    "number.base": "Budget limit must be a number",
    "number.positive": "Budget limit must be positive",
    "any.required": "Budget limit is required",
  }),
});
