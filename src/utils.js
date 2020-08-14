const chalk = require("chalk");

const logERR = (string) => {
  console.log(chalk.red(string));
};
const logSUCC = (string) => {
  console.log(chalk.green(string));
};
const logINFO = (string) => {
  console.log(chalk.blue(string));
};
const Valid = (updates, allowUpdates) => {
  let check = true;
  for (let i in updates) if (!allowUpdates.includes(updates[i])) check = false;
  return check;
};

module.exports = { Valid, logSUCC, logERR, logINFO };
