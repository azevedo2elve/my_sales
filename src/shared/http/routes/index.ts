import { Router } from 'express';

const routes = Router();

routes.get('/health', (req, res) => {
  return res.json({ message: "Hello Dev! I'm alive!" });
});

export default routes;
