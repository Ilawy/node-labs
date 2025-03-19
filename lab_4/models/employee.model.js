//@ts-check
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
// import mongooseAutoIncrement from 'mongoose-auto-increment'

export const profileSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  yearOfExperience: {
    type: Number,
    default: 0,
  },
  department: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: {
      validator(value) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
      },
      message: "A valid email is required",
    },
  },
});

export const employeeSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: {
        unique: true,
        dropDups: true,
      },
      validate: {
        validator(value) {          
          return /[a-zA-Z]\w{7,}/i.test(value);
        },
        message: () =>
          `username must be at least 8 characters (starting with alphabetical)`,
      },
    },
    firstName: {
      type: String,
      required: true,
      validate: {
        validator: (value) => /[A-Z][a-z]{2,14}/.test(value),
        message: `First name must be 3-15 character, capitalized`,
      },
    },
    lastName: {
      type: String,
      required: true,
      validate: {
        validator: (value) => /[A-Z][a-z]{2,14}/.test(value),
        message: `Last name must be 3-15 character, capitalized`,
      },
    },
    dob: {
      type: Date,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },

    profile: profileSchema,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
      }
    }
  }
);

employeeSchema.virtual("age").get(function () {
  return new Date().getFullYear() - new Date(this.dob).getFullYear();
});

employeeSchema.methods.verifyPassword = async function(plain){  
  return await bcrypt.compare(plain, this.password)
}

employeeSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

employeeSchema.pre('findOneAndUpdate', async function(){
  const update = this.getUpdate()
  console.log(update);
  
  if(!update || !("password" in update))return;
  console.log(this.setUpdate({
    ...update,
    password: await bcrypt.hash(update.password, 10)
  }));
  
})
// employeeSchema.pre(['updateMany', 'updateOne', 'findOneAndUpdate'], function (next) {
//   this.setOptions({
//     runValidators: true
//   })

//   next();
// });

export const Employee = mongoose.model("employee", employeeSchema);
