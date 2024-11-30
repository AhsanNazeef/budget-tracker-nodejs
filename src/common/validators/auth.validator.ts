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
});
