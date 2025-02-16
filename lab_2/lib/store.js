//@ts-check
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
// Used as type
// eslint-disable-next-line no-unused-vars
import { Employee } from "./employee.js";

/**
 *
 * @param {string} dataFile
 * @returns {Promise<{lastid: number; data: typeof Employee[]}>}
 */
async function getData(
  dataFile = join(".", "data.json"),
  metaFile = join(".", "meta.json"),
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
 * @param {{lastid: number; data: typeof Employee[]}} payload
 * @param {string} dataFile
 * @param {string} metaFile
 * @returns
 */
async function saveData(
  payload,
  dataFile = join(".", "data.json"),
  metaFile = join(".", "meta.json"),
) {
  await writeFile(dataFile, JSON.stringify(payload.data));
  await writeFile(metaFile, JSON.stringify({ lastid: payload.lastid }));
}

const _getData = getData;
export { _getData as getData };
const _saveData = saveData;
export { _saveData as saveData };
