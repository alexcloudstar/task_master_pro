import {
	getUsers,
	getUser,
	register,
	updateProfile,
} from '../controllers/User.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/', updateProfile);
router.post('/signup', register);

export default router;
