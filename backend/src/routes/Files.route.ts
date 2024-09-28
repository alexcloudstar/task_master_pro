import { getFile, getFiles } from '../controllers/Files.controller';
import { Router } from 'express';

const router = Router();

router.get('/:folder', getFiles);
router.get('/:folder/:file', getFile);

export default router;
