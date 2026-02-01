import express from "express";
import { ENV } from "./lib/env.js";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Yes" });
});

app.listen(3000, () => {
  console.log("Port 3000");
});
