import { Router } from 'express';
import { getPosts, createPost } from '../controllers/community.controller';

const router = Router();

router.get('/posts', getPosts);
router.post('/posts', createPost);

export default router;
