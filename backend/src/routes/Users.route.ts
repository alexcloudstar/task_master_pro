import {
	getUsers,
	getUser,
	updateProfile,
	getProfile,
	deleteProfile,
    getStats,
} from '../controllers/Users.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getUsers);
router.get('/stats', getStats);
router.get('/me', getProfile);
router.get('/:id', getUser);
router.put('/', updateProfile);
router.delete('/', deleteProfile);

export default router;
