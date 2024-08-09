import Joi from "joi";

const createAddressValidation = Joi.object({
  street: Joi.string().max(255).optional(),
  city: Joi.string().max(100).optional(),
  province: Joi.string().max(100).optional(),
  country: Joi.string().max(100).required(),
  postal_code: Joi.string().max(10).optional(),
});

const getAddressValidation = Joi.string().required();

const updateAddressValidation = Joi.object({
  _id: Joi.string().required(),
  street: Joi.string().max(255).optional(),
  city: Joi.string().max(100).optional(),
  province: Joi.string().max(100).optional(),
  country: Joi.string().max(100).required(),
  postal_code: Joi.string().max(10).optional(),
});

export { createAddressValidation, getAddressValidation, updateAddressValidation };
