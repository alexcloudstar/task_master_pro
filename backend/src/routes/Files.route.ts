import { getFile, uploadFile } from '../controllers/Files.controller';
import { Router } from 'express';

const router = Router();

router.get('/:folder/:file', getFile);
router.post('/', uploadFile);


export default router;
