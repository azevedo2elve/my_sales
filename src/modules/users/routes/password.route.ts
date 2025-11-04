import { Router } from 'express';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';
import {
  forgotPassowrdSchema,
  resetPasswordSchema,
} from '../schemas/password.schema';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post(
  '/forgot',
  forgotPassowrdSchema,
  forgotPasswordController.create,
);

passwordRouter.post(
  '/reset',
  resetPasswordSchema,
  resetPasswordController.create,
);

export default passwordRouter;
