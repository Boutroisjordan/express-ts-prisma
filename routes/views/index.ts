import express from "express"
import productViewRouter from "./product/productViewRouter";


const views = express();

// views.use("/product", userRouter)
// views.use("/auth", authRouter)
views.use("/product", productViewRouter)

export default views;