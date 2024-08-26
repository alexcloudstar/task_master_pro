import { getUsers, register } from '../controllers/User.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getUsers);
router.post('/signup', register);

export default router;
