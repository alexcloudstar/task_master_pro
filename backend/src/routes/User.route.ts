import {
	getUsers,
	getUser,
	register,
	updateProfile,
    getProfile,
    deleteProfile,
} from '../controllers/User.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getUsers);
router.get('/me', getProfile);
router.get('/:id', getUser);
router.put('/', updateProfile);
router.delete('/', deleteProfile);
router.post('/signup', register);

export default router;
