import { Router } from 'express';
import UpdateAvatarController from '../controllers/UpdateAvatarController';
import multer from 'multer';
import uploadConfig from '@config/upload';
import AuthMiddleware from '../../../shared/middlewares/AuthMiddleware';

const avatarRouter = Router();
const userAvatarController = new UpdateAvatarController();
const upload = multer(uploadConfig);

avatarRouter.patch(
  '/',
  AuthMiddleware.execute,
  upload.single('avatar'),
  userAvatarController.update,
);

export default avatarRouter;
