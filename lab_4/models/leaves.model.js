//@ts-check
// import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
// import mongooseAutoIncrement from 'mongoose-auto-increment'

const leavesSchema = new mongoose.Schema({
    empId: {
        type: mongoose.Types.ObjectId,
        ref: "employee",
        required: true
    },
    type: {
        type: String,
        enum: ["annual", "casual", "sick"],
        required: true,
    },
    duration: {
        type: Number,
        validate: {
            validator: (/** @type {number} */ v)=>v > 0
        }
    },
    status: {
        type: String,
        enum: ["inprogress", "cancelled", "ended"],
        default: "inprogress"
    }
}, {
    timestamps: true
});
leavesSchema.pre(["updateMany", "updateOne", 'findOneAndUpdate'], ()=>{
    console.log("LOL");
    
})


export const Leave = mongoose.model('leaves', leavesSchema);