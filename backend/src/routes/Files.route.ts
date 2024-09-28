import { getFile } from '../controllers/Files.controller';
import { Router } from 'express';

const router = Router();

router.get('/:folder/:file', getFile);

export default router;
