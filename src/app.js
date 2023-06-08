import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import favRoutes from "./routes/favs.routes.js";

const app = express();
app.use(cors());

//Middleware
app.use(express.json());
app.use("/user", userRoutes);
app.use("/favs", favRoutes);

export default app;
