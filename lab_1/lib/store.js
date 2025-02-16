//@ts-check
const { readFile, writeFile } = require("fs/promises");
const path = require("path");
const { Employee } = require("./employee");

/**
 *
 * @param {string} dataFile
 * @returns {Promise<{lastid: number; data: Employee[]}>}
 */
async function getData(
  dataFile = path.join(__dirname, "..", "data.json"),
  metaFile = path.join(__dirname, "..", "meta.json"),
) {
  /**@type {{lastid: number}} */
  const meta = await readFile(metaFile, "utf-8")
    .then(JSON.parse)
    .catch((error) => {
      if (error.errno === -2 || error instanceof SyntaxError)
        return { lastid: 0 };
      else throw error;
    });
  /**@type {Employee[]} */
  const data = await readFile(dataFile, "utf-8")
    .then(JSON.parse)
    .catch((error) => {
      if (error.errno === -2 || error instanceof SyntaxError) return [];
      else throw error;
    });

  return { data, ...meta };
}

/**
 *
 * @param {{lastid: number; data: Employee[]}} payload
 * @param {string} dataFile
 * @param {string} metaFile
 * @returns
 */
async function saveData(
  payload,
  dataFile = path.join(__dirname, "..", "data.json"),
  metaFile = path.join(__dirname, "..", "meta.json"),
) {
  await writeFile(dataFile, JSON.stringify(payload.data));
  await writeFile(metaFile, JSON.stringify({ lastid: payload.lastid }));
}

module.exports.getData = getData;
module.exports.saveData = saveData;
