import {
	createSprint,
	deleteSprint,
	getSprint,
	getSprints,
	updateSprint,
} from '../controllers/Sprints.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getSprints);
router.get('/:id', getSprint);
router.post('/', createSprint);
router.put('/:id', updateSprint);
router.delete('/:id', deleteSprint);

export default router;
