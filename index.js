import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/connectdb.js";
import router from "./routes/userRoutes.js";
const app = express();
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
app.use(cors());

// DATABSE  Connection

connectDB(DATABASE_URL);

// json
app.use(express.json());

app.use("/api/user", router);

app.listen(port, () => {
  console.log(`Server start at http://localhost:${port}`);
});
