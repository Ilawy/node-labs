//@ts-check

const { Employee } = require("../lib/employee");
const { parseArgs } = require("../lib/parser");
const { getData, saveData } = require("../lib/store");
const {
  isValidNumber,
  isValidLevel,
  ALLOWED_LEVELS,
  isValidEmail,
} = require("../lib/validators");

/**
 *
 * @param {string[]} args
 */
async function addOP(args) {
  const storage = await getData();

  const parsedArgs = parseArgs(args);
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
    _,
    ...extra
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
  if (salaryAsNumber === null)
    throw new Error("salary must be valid positive number");

  /** @type {Employee} */
  const employee = {
    ...extra,
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


async function deleteOP(args) {
  const storage = await getData();

  const id = args[0];
  if (id === undefined) throw new Error("id is required");
  const lengthBefore = storage.data.length;

  storage.data = storage.data.filter((employee) => employee.id != id);
  if (lengthBefore !== storage.data.length) {
    await saveData(storage);
    console.log("User deleted successfully");
  } else {
    console.log(`User with id (${id} not found`);
  }
}


/**
 *
 * @param {string[]} args
 */
async function editOP(args) {
  const storage = await getData();

  const id = args[0];

  const { _, id: _id, ...newProps } = parseArgs(args.slice(1));
  const employeeIndex = storage.data.findIndex(
    (employee) => `${employee.id}` == id,
  );
  if (employeeIndex === -1) throw new Error("No user found with this id");

  if ("email" in newProps && !isValidEmail(newProps.email)) {
    throw new Error("email is not valid");
  }

  if ("salary" in newProps && !isValidNumber(newProps.salary)) {
    throw new Error("salary need to be a valid positive number");
  }

  if ("level" in newProps && !isValidLevel(newProps.level)) {
    throw new Error(
      `level is invalid, possible values are ${ALLOWED_LEVELS.join(
        ", ",
      )} - got ${newProps.level}`,
    );
  }

  if (
    "yearsOfExperience" in newProps &&
    !isValidNumber(newProps.yearsOfExperience)
  ) {
    throw new Error("yearsOfExperience need to be a valid positive number");
  }

  Object.assign(storage.data[employeeIndex], newProps);

  await saveData(storage);
}


/**
 *
 * @param {string[]} args
 */
async function listOP(args) {
  const storage = await getData();

  const filters = parseArgs(args);

  const filteredData = storage.data.filter((employee) => {
    return Object.entries(filters)
      .map(([filter, value]) => {
        return employee[filter] == value;
      })
      .every(Boolean);
  });

  if (filteredData.length === 0) {
    console.log("no users found");
    return;
  }

  console.log(
    filteredData
      .map((employee) => {
        return Object.entries(employee)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
      })
      .join("\n"),
  );
}

module.exports.listOP = listOP;
module.exports.addOP = addOP;
module.exports.deleteOP = deleteOP;
module.exports.editOP = editOP;
