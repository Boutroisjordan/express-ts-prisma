import express from "express"
import userRouter from "./user/user.router";
import authRouter from "./auth/auth.router";
import productRouter from "./product/product.router";


const api = express();

api.use("/user", userRouter)
api.use("/auth", authRouter)
api.use("/product", productRouter)

export default api;