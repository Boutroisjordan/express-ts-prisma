import express from "express"
import userRouter from "./user/user.router";
import authRouter from "./auth/auth.router";
import productRouter from "./product/product.router";
import orderRouter from "./order/order.router";


const api = express();

api.use("/user", userRouter)
api.use("/auth", authRouter)
api.use("/product", productRouter)
api.use("/order", orderRouter)

export default api;