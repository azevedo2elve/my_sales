import { Router } from 'express';
import SessionController from '../controllers/SessionController';
import { sessionSchema } from '../schemas/session.schema';

const sessionRouter = Router();
const sessionController = new SessionController();

sessionRouter.post('/', sessionSchema, sessionController.create);

export default sessionRouter;
