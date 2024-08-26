import { getUsers, login, register } from '../controllers/User.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getUsers);
router.post('/signup', register);
router.post('/signin', login);

export default router;
