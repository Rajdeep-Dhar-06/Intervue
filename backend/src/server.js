import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { inngest } from "./lib/inngest.js";
import { functions } from "./lib/inngest.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors());
app.use("/api/inngest", serve({ client: inngest, functions }));

app.use(clerkMiddleware()); //req.auth()

app.use("/api/chat", chatRoutes);

if (ENV.NODE_ENV === "production") {
  const frontendDist = path.resolve(__dirname, "../../frontend/dist");
  app.use(express.static(frontendDist));
  console.log("Serving frontend from:", frontendDist);

  app.use((req, res) => {
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
