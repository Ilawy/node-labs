//@ts-check

import { getData, saveData } from "./store.js";
// used as type
// eslint-disable-next-line no-unused-vars
import { Employee } from "./employee.js"
import { isValidEmail, isValidLevel, isValidNumber, ALLOWED_LEVELS } from "./validators.js";
/**
 *
 * @param {typeof Employee} parsedArgs
 */
export async function addOP(parsedArgs) {
  console.log(parsedArgs);

  const storage = await getData();


  const id = storage.lastid++;

  //get only required, but not provided fields
  const requiredFields = ["name", "email", "salary"].filter(
    (field) => !(field in parsedArgs),
  );

  //ensure all require fields are provided
  if (!requiredFields.every((field) => field in parsedArgs))
    throw new Error(
      `all following argumens are required: ${requiredFields.join(", ")}`,
    );

  const {
    level = "jr",
    yearsOfExperience = "0",
    name,
    email,
    salary,
  } = parsedArgs;

  //yearsOfExperience validation
  const yearsOfExperienceAsNumber = isValidNumber(yearsOfExperience);
  if (yearsOfExperienceAsNumber === null)
    throw new Error("years of expecriance must be valid positive number");

  //level validation
  if (!isValidLevel(level))
    throw new Error(
      `Invalid level name, possible values are ${ALLOWED_LEVELS.join(", ")}`,
    );

  //email validation
  if (!isValidEmail(email)) throw new Error(`invalid email address`);

  //salary validation
  const salaryAsNumber = isValidNumber(salary);
  if (salaryAsNumber === null || salaryAsNumber === 0)
    throw new Error("salary must be valid positive number");

  /** @type {Employee} */
  const employee = {
    id,
    name,
    email,
    salary: salaryAsNumber,
    level,
    yearsOfExperience: yearsOfExperienceAsNumber,
  };
  console.log(storage);

  await saveData({
    lastid: storage.lastid,
    data: [...storage.data, employee],
  });
}


