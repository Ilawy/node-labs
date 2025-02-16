//@ts-check
export const ALLOWED_LEVELS = ["jr", "mid-level", "sr", "lead"];

export const isValidEmail = (e) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e);

export  const isValidLevel = (value) => ALLOWED_LEVELS.indexOf(value) !== -1;

export const isValidNumber = (value) => {
  const valueAsNumber = parseInt(value);
  if (Number.isNaN(valueAsNumber) || valueAsNumber < 0) return null;
  return valueAsNumber;
};

