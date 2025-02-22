import { EmployeeModel } from './employee.js'

/**@type {import("express").Handler} */
export function validateEmployeeMiddleware(req, res, next) {
  const result = EmployeeModel.omit({
    id: true,
  }).safeParse(req.body)

  if (result.success) {
    req.body = result.data
    next()
    return
  }

  res.status(400).json({
    message: result.error.message,
  })
}
