import { celebrate, Joi, Segments } from 'celebrate';

export const updateUserSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    old_password: Joi.string(),
    password: Joi.string().optional(),
    password_confirmation: Joi.string()
      .valid(Joi.ref('password'))
      .when('password', {
        is: Joi.exist(),
        then: Joi.required(),
      }),
  }),
});
