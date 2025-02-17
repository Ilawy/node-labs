import { createReadStream } from "fs";
import { stat } from "fs/promises";
// WHY? they're already used in function signature
// eslint-disable-next-line no-unused-vars
import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import { addOP } from "./lib/operations.js";
import { getData } from "./lib/store.js";

const getStaticFilePath = (file) => path.join(".", "static", file);

/**
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {boolean} plain
 */
function notFound(req, res, plain = false) {
  if (plain) {
    res.writeHead(404);
    res.end("not found");
    return;
  }
  createReadStream(getStaticFilePath("404.html")).pipe(res);
}

/**
 * @type {Record<string, (req: IncomingMessage, res: ServerResponse)=>Promise<unknown>>}
 */
export const routes = {
  "/": async (req, res) => {
    createReadStream(getStaticFilePath("index.html")).pipe(res);
  },

  "/astronomy": async (req, res) => {
    createReadStream(getStaticFilePath("astronomy.html")).pipe(res);
  },

  "/astronomy/download": async (req, res) => {
    res.setHeader('Content-disposition', 'attachment; filename=file.png');
    createReadStream(getStaticFilePath("image_1.png")).pipe(res);
  },
  "/serbal": async (req, res) => {
    createReadStream(getStaticFilePath("serbal.html")).pipe(res);
  },

  "/employee": async (req, res) => {
    if (req.method === "GET") {
      createReadStream(getStaticFilePath("employee.html")).pipe(res);
    } else if (req.method === "POST") {
      let rawData = ""
      req.on("data", async (e) => {
        rawData += e.toString()
      });

      req.on("end", async e => {
        try {
          await addOP(Object.fromEntries(new URLSearchParams(rawData)));

          //a trick to redirect using html
          res.writeHead(200, { "content-type": "text/html" })
          res.end(`<head>
            <meta http-equiv="refresh" content="0; url = /"/>
            </head>`)
        } catch (error) {
          res.writeHead(200, { "content-type": "text/html" })
          res.end(`<head>
            <meta http-equiv="refresh" content="0; url = /employee?error=${decodeURIComponent(error.message)}"/>
            </head>`)
        }
      })


    } else {
      notFound(req, res);
    }
  },

  "/api/getEmployees": async (req, res) => {
    if (req.method !== "GET") {
      notFound();
      return;
    }
    const storage = await getData()


    res.writeHead(200, {
      "content-type": "application/json",
    });

    // hide id from data
    res.end(JSON.stringify(storage.data.map(employee => {
      delete employee.id
      return employee
    })))
  },

  "*": async (req, res) => {
    const { url, method } = req;
    const fileExists = await stat(getStaticFilePath(url))
      .then((s) => s.isFile())
      .catch(() => false);
    if (fileExists && method === "GET") {
      if (url.endsWith(".js")) {
        res.setHeader("content-type", "application/javascript");
      }
      const stream = createReadStream(getStaticFilePath(url));
      stream.pipe(res);
    } else {
      notFound(req, res);
    }
  },
};
