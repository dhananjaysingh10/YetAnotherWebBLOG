import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, getposts, deletepost, updatepost } from '../controllers/post.controller.js';

const route = express.Router();

route.post('/create', verifyToken, create);
route.put('/updatepost/:postId/:userId', verifyToken, updatepost);
route.get('/getposts', getposts);
route.delete('/deletepost/:postId/:userId', verifyToken, deletepost);

export default route