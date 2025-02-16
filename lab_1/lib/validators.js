//@ts-check
const ALLOWED_LEVELS = ["jr", "mid-level", "sr", "lead"];

const isValidEmail = (e) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e);

const isValidLevel = (value) => ALLOWED_LEVELS.indexOf(value) !== -1;

const isValidNumber = (value) => {
  const valueAsNumber = parseInt(value);
  if (Number.isNaN(valueAsNumber) || valueAsNumber < 0) return null;
  return valueAsNumber;
};

module.exports.isValidEmail = isValidEmail;
module.exports.isValidLevel = isValidLevel;
module.exports.isValidNumber = isValidNumber;
module.exports.ALLOWED_LEVELS = ALLOWED_LEVELS;
