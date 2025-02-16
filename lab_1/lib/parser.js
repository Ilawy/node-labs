/**
 *
 * @param {string[]} args
 */
function parseArgs(args) {
  const result = {};
  for (const arg of args) {
    const execResult = /^--(.*?)=(.*?)$/.exec(arg);
    if (!execResult) {
      result._ = [...(result._ || []), arg];
    } else result[execResult[1]] = execResult[2];
  }
  return result;
}

module.exports.parseArgs = parseArgs;
