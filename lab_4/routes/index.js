import {Router} from 'express';
import employeesRouter from './employees.js';
import leavesRouter from './leaves.js';

const baseRouter = Router();

baseRouter.use('/employees', employeesRouter);
baseRouter.use('/leave', leavesRouter);

export default baseRouter;
