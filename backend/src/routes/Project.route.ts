import {
	createProject,
	deleteProject,
	getProject,
	getProjects,
	updateProject,
} from '../controllers/Project.controller';
import { Router } from 'express';

const router = Router();

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
