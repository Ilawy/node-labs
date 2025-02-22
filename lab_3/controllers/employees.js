import { EmployeeModel } from '../lib/employee.js'
import { getData, saveData } from '../lib/store.js'

export async function getEmployeeById(id) {
  const storage = await getData()
  return storage.data.find(row => row.id === id)
}

export const EmployeeWithoutId = EmployeeModel.omit({
  id: true,
})

/**
 *
 * @param {z.infer<typeof EmployeeWithoutId>} data
 */
export async function createNewEmployee(newEmployee) {
  let { data, lastid } = await getData()
  const newId = lastid++
  newEmployee.id = newId
  data.push(newEmployee)
  await saveData({ data, lastid })
  return newEmployee
}

export async function deleteEmployeeById(id) {
  const storage = await getData()
  const beforeLength = storage.data.length
  storage.data = storage.data.filter(item => item.id !== id)
  const afterLength = storage.data.length

  await saveData(storage)
  return beforeLength - afterLength
}

export async function updateEmoloyeeById(id, data) {
  const storage = await getData()
  const index = storage.data.findIndex(employee => employee.id === id)
  console.log(index, id)

  if (index === -1) {
    return null
  }
  storage.data[index] = {
    ...storage.data[index],
    ...data,
    id: storage.data[index].id,
  }

  await saveData(storage)
  return storage.data[index]
}
