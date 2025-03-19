import { wrapPromise } from "../lib/result.js"
import { Leave } from "../models/leaves.model.js"




export const LeaveService = {
    create(payload){
        return wrapPromise(Leave.create(payload))
    },
    getAll(skip, limit, query){
        return wrapPromise(Leave.find(query).skip(skip).limit(limit).populate('empId', 'firstName lastName _id'))
    },
    updateById(leaveId, userId, payload){
        return wrapPromise(Leave.updateOne({ _id: leaveId, empId: userId }, payload, {
            runValidators: true
        }))
    }
}