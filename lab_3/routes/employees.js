import { Router } from 'express'
import _ from 'lodash'
import { z } from 'zod'
import {
  createNewEmployee,
  deleteEmployeeById,
  getEmployeeById,
  updateEmoloyeeById,
} from '../controllers/employees.js'
import { EmployeeModel } from '../lib/employee.js'
import { getData } from '../lib/store.js'
import { validateEmployeeMiddleware } from '../lib/validators.js'

export const employeesRouter = Router()

employeesRouter.get('/', async (req, res) => {
  const { query } = req
  const filterKeys = Object.keys(query)
  const storage = await getData()
  const filteredData = storage.data.filter((employee) => {
    return filterKeys.every(key => employee[key] == query[key])
  })

  res.render('employees', {
    employees: filteredData.map(e => _.omit(e, ['id'])),
    title: 'Hello',
  })
})

employeesRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  const result = z.number().int().safeParse(+id)
  if (!result.success) {
    res.status(400).json({
      message: 'Invalid employee id',
    })
    return
  }
  const employee = await getEmployeeById(result.data)
  if (!employee) {
    res.status(404).json({
      message: 'Employee not found',
    })
    return
  }
  res.json(_.omit(employee, ['id']))
})

employeesRouter.post('/', validateEmployeeMiddleware, async (req, res) => {
  res.json(await createNewEmployee(req.body))
})

// use regex for int
employeesRouter.delete('/:id', async (req, res) => {
  const { id } = req.params
  const result = z.number().int().safeParse(+id)
  if (!result.success) {
    res.status(400).json({
      message: 'Invalid employee id',
    })
    return
  }

  const deleteCount = await deleteEmployeeById(result.data)
  res.json({
    deleteCount,
  })
})

employeesRouter.patch('/:id', async (req, res) => {
  const { id } = req.params
  const idResult = z.number().int().safeParse(+id)
  if (!idResult.success) {
    res.status(400).json({
      message: 'Invalid employee id',
    })
    return
  }
  const employeeResult = EmployeeModel.partial().safeParse(req.body)
  if (!employeeResult.success) {
    res.status(400).json({ message: employeeResult.error.message })
    return
  }
  const result = await updateEmoloyeeById(idResult.data, employeeResult.data)
  //!!! value or error
  if (result === null) {
    //employee not found
    res.status(404).json({ message: 'Employee not found' })
    return
  }

  res.json(result)
})
