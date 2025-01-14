import express from 'express';
import {getTemplate} from '../controllers/template.controller.js'

const route = express.Router();

route.get('/gettemplate', getTemplate);

export default route;
