import { celebrate, Joi, Segments } from 'celebrate';

export const forgotPassowrdSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
});

export const resetPasswordSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    token: Joi.string().uuid().required(),
    password: Joi.string().required(),
    password_confirmation: Joi.string().valid(Joi.ref('password')).required(),
  }),
});
