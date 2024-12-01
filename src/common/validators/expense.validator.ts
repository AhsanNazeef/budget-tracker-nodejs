import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

export const expenseSchema = Joi.object({
  title: Joi.string()
    .max(30)
    .pattern(/^[a-zA-Z\s-]+$/)
    .required(),
  price: Joi.number().positive().required(),
  date: Joi.date().format("DD/MM/YYYY").required(),
});

export const expensePatchSchema = Joi.object({
  title: Joi.string()
    .max(30)
    .pattern(/^[a-zA-Z\s-]+$/),
  price: Joi.number().positive(),
  date: Joi.date().format("DD/MM/YYYY"),
}).min(1);

export const expenseQuerySchema = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100),
  search: Joi.string(),
  startDate: Joi.date().format("DD/MM/YYYY"),
  endDate: Joi.date().format("DD/MM/YYYY"),
  sortBy: Joi.string().valid("price", "date"),
  sortOrder: Joi.string().valid("asc", "desc"),
});
