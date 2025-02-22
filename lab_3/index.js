import express from 'express'

import { employeesRouter } from './routes/employees.js'

const app = express()
app.use(express.static('public'))
app.use(express.json())

app.set('view engine', 'pug')
app.set('views', 'views')

app.use('/employees', employeesRouter)

app.listen(3000, () => {
  console.log('Listening on port :3000')
})
