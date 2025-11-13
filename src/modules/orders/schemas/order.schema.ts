import { celebrate, Joi, Segments } from 'celebrate';

export const idParamsValidate = celebrate({
  [Segments.PARAMS]: {
    id: Joi.number().required(),
  },
});

export const createOrderValidate = celebrate({
  [Segments.BODY]: {
    customer_id: Joi.number().required(),
    products: Joi.required(),
  },
});
