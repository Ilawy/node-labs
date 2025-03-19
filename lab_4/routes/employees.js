import {Router} from 'express';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import {wrapPromise} from '../lib/result.js';
import authMiddleware from '../middlewares/auth.js';
import {Employee} from '../models/employee.model.js';
import {EmployeeService} from '../services/employee.service.js';

const employeesRouter = Router();

employeesRouter.post('/', async (req, res) => {
  await (new Employee(req.body).validate());
  const result = await Employee.create(req.body);
  const user = _.omit(result.toJSON(), ['password']);
  res.json({
    user,
    token: jwt.sign({id: user._id})
  });
});

employeesRouter.post('/login', async (req, res) => {
  const {username, password} = req.body;
  if (!username || !password) return res.status(401).json({message: 'username and password are required'});
  const [error, token] = await wrapPromise(EmployeeService.login(username, password));
  if (error) return res.status(401).json({message: error.message});

  res.json({token});
});

employeesRouter.get('/', authMiddleware, async (req, res) => {
  const [error, result] = await EmployeeService.getAll();
  if (error) throw error;
  res.json(result.map((r) => r.toJSON({virtuals: true})));
});

employeesRouter.delete('/:id', authMiddleware, async (req, res) => {
  // const { id } = req.params
  const id = req.user.id;
  const [error, {deletedCount}] = await EmployeeService.deleteById(id);
  if (error) throw error;

  res.json({deletedCount});
});

employeesRouter.get('/:id/leaves', authMiddleware, async (req, res) => {
  // const { id } = req.params
  const id = req.user.id;
  const [error, result] = await EmployeeService.getLeaves(id);
  if (error) throw error;
  res.json(result);
});

employeesRouter.patch('/:id', authMiddleware, async (req, res) => {
  // const { id } = req.params
  const id = req.user.id;
  const [error, result] = await EmployeeService.updateById(id, req.body);
  if (error) throw error;

  res.json(result);
});

export default employeesRouter;
