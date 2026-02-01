import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Yes" });
});

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist"));
  });
}

app.listen(3000, () => {
  console.log("Port 3000");
});
