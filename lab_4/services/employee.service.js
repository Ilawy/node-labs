//@ts-check
import _ from "lodash";
import { wrapPromise } from "../lib/result.js";
import { Employee, employeeSchema } from "../models/employee.model.js";
import { Leave } from "../models/leaves.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const EmployeeService = {
  /**
   * @param {any} payload
   */
  async create(payload) {
    console.log(payload);

    let [employeeError, employee] = await wrapPromise(Employee.create(payload));
    // if(employeeError === null)
  },

  async getAll() {
    return await wrapPromise(
      Employee.find(
        {},
        {
          __v: 0,
        }
      )
    );
  },

  /**
   * @param {string} id
   */
  async deleteById(id) {
    return wrapPromise(
      Employee.deleteOne({
        _id: id,
      })
    );
  },

  /**
   * @param {string} id
   * @param {any} payload
   */
  async updateById(id, payload) {
    return wrapPromise(
      Employee.findByIdAndUpdate(
        id,
        _.omit(payload, ["_id"]),
        {
          runValidators: true,
        }
      )
    );
  },

  async getLeaves(id){
    return wrapPromise(Leave.find({
      empId: id
    }))
  },

  async login(username, password){
    const user = await Employee.findOne({ username })
    if(!user)throw new Error("Username or password are invalid");
    const isValidPassword = await user.verifyPassword(password)
    if(!isValidPassword){
      throw new Error("Username of password are invalid")
    }
    const token = jwt.sign({
      id: user._id
    }, "secret")
    return token
  }


};
