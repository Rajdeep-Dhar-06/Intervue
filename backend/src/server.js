import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { inngest } from "./lib/inngest.js";
import { functions } from "./lib/inngest.js";
import { serve } from "inngest/express";

const app = express();
const __dirname = path.resolve();

//middleware
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Yes" });
});

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log("Server running on port:", ENV.PORT);
    });
  } catch (error) {
    console.error("❎ Error starting the server", error);
  }
};

startServer();
