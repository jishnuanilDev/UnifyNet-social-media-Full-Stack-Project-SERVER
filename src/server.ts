import express, { Application } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDb from "./config/database";
import cors from "cors";
import cookieParser = require("cookie-parser");
import userRouter from "./routes/user-routes";
import postRouter from "./routes/post-routes";
import adminRouter from "./routes/admin-routes";
import nocache = require("nocache");
import path from "path";

import { chatInitializeSocket } from "./config/sockets/socket";
import { webRtcSocket } from "./config/sockets/webRtcSocket";
import { notificationSocket } from "./config/sockets/notificatonSocket";
import { Server, Socket } from "socket.io";

dotenv.config();

const app: Application = express();
const PORT = 5000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// app.use(
//   cors({
//     origin: [
//       "https://unifynet.jisonline.site", // Add your frontend domain
//       "http://localhost:3000", // For local development
//       "http://13.67.149.93:5000", // For testing purposes (adjust as necessary)
//     ], // Adjust to your frontend URL
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: ["https://unifynet.jisonline.site", "http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(nocache());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/", userRouter);
app.use("/", postRouter);
app.use("/admin", adminRouter);

connectDb();

chatInitializeSocket();
webRtcSocket();
notificationSocket();

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
