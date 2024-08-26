import { getUsers, getUser, register } from '../controllers/User.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/signup', register);

export default router;
