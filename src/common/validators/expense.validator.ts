import Joi from "joi";

export const expenseSchema = Joi.object({
  title: Joi.string()
    .max(30)
    .pattern(/^[a-zA-Z\s-]+$/)
    .required(),
  price: Joi.number().positive().required(),
  date: Joi.string().isoDate().required().messages({
    "string.isoDate": "Date must be in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)",
  }),
});

export const expensePatchSchema = Joi.object({
  title: Joi.string()
    .max(30)
    .pattern(/^[a-zA-Z\s-]+$/),
  price: Joi.number().positive(),
  date: Joi.string().isoDate().messages({
    "string.isoDate": "Date must be in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)",
  }),
}).min(1);

export const expenseQuerySchema = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100),
  search: Joi.string(),
  startDate: Joi.string().isoDate().messages({
    "string.isoDate":
      "Start date must be in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)",
  }),
  endDate: Joi.string().isoDate().messages({
    "string.isoDate":
      "End date must be in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)",
  }),
  sortBy: Joi.string().valid("price", "date"),
  sortOrder: Joi.string().valid("asc", "desc"),
});
