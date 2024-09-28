import multer from 'multer';
import { getFile, uploadFile } from '../controllers/Files.controller';
import { Router } from 'express';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/:folder/:file', getFile);
router.post('/:folder', upload.single('file'), uploadFile);

export default router;
