import { z } from 'zod'

export const Employee = {
  id: 0,
  name: '',
  email: '',
  salary: 0,
  level: '',
  yearsOfExperience: 0,
}

export const EmployeeModel = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  salary: z.number().positive(),
  yearsOfExperience: z.number().min(0).default(0),
  level: z
    .union([
      z.literal('jr'),
      z.literal('sr'),
      z.literal('mid-level'),
      z.literal('lead'),
    ])
    .default('jr'),
}).catchall(z.any())
