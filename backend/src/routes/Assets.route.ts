import { getAsset, getAssets } from '../controllers/Assets.controller';
import { Router } from 'express';

const router = Router();

router.get('/:folder', getAssets);
router.get('/:folder/:file', getAsset);

export default router;
