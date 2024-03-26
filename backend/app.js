import express from "express";

import products from "./routes/productRoute.js";
import user from "./routes/userRoute.js";
import order from "./routes/orderRoute.js";

import errorMiddleware from "./middleware/error.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", products);
app.use("/api/v1", user);
app.use("/api/v1", order);

//Error Middleware Handling
app.use(errorMiddleware);
export default app;