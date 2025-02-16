//@ts-check
const chalk = require("chalk");
const { Employee } = require("./lib/employee");
const { getData, saveData } = require("./lib/store");
const {
  isValidEmail,
  isValidLevel,
  ALLOWED_LEVELS,
  isValidNumber,
} = require("./lib/validators");
const { addOP, deleteOP, editOP, listOP } = require("./subcommands/operations");

const operations = {
  add: addOP,
  delete: deleteOP,
  edit: editOP,
  list: listOP,
};

const args = process.argv.slice(3);
const operation = process.argv[2];

// main function
async function main() {
  const commandFn = operations[operation];
  if(!commandFn)throw new Error(`Unknown command, allowed commands are: ${Object.keys(operations).join(", ")}`)
  commandFn?.(args);
}

main()
.catch((error) => {
  const prefix = `${chalk.bgRedBright(chalk.bold("Error"))}`;
  console.log(`${prefix}: ${error.message}`);
});
