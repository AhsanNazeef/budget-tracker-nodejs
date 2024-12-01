import JoiBase from "joi";
import JoiDate from "@joi/date";

const Joi = JoiBase.extend(JoiDate);

export const profileUpdateSchema = Joi.object({
  phoneNumber: Joi.string().max(15),
  fatherName: Joi.string().max(50),
  gender: Joi.string().valid("male", "female", "other"),
  zipCode: Joi.string().max(10),
  address: Joi.string().max(200),
  dateOfBirth: Joi.date().format("DD/MM/YYYY"),
  photo: Joi.string(),
  aboutMe: Joi.string().max(500),
}).min(1);
