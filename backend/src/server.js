import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { inngest } from "./lib/inngest.js";
import { functions } from "./lib/inngest.js";
import { serve } from "inngest/express";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middleware
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

// app.get("/", (req, res) => {
//   res.status(200).json({ msg: "Yes" });
// });

if (ENV.NODE_ENV === "production") {
  const frontendDist = path.resolve(__dirname, "../../frontend/dist");

  app.use(express.static(frontendDist));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

if (ENV.NODE_ENV === "production") {
  const frontendDist = path.resolve(__dirname, "../../frontend/dist");
  app.use(express.static(frontendDist));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
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

//npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
