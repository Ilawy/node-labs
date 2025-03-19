
import process from "node:process";
import express from "express";
import 'express-async-handler'
import mongoose from "mongoose";

import baseRouter from "./routes/index.js";
import "dotenv/config";
import cors from "cors";

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("Cannot access mongo uri");

mongoose.connect(MONGO_URI);
// mongoose.set('runValidators', true)
// mongooseAutoIncrement.initialize(mongoose)
const app = express();
app.use(
  cors({
    origin: "http://localhost:8000",
  })
);

app.use(express.json(), baseRouter);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ status: 400, message: err.message }); // Bad request
  }
  next();
});

app.listen(PORT, () => {
  console.log(`listening on :${PORT}`);
});
