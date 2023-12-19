import express from "express"
import userRouter from "./api/users/user.router";
import authRouter from "./api/auth/auth.routes";


const api = express();

api.use("/users", userRouter)
api.use("/auth", authRouter)

export default api;