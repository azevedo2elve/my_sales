import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';
import AuthMiddleware from '@shared/middlewares/AuthMiddleware';
import { updateUserSchema } from '../schemas/update.schema';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(AuthMiddleware.execute);
profileRouter.get('/', profileController.show);
profileRouter.patch('/', updateUserSchema, profileController.update);

export default profileRouter;
