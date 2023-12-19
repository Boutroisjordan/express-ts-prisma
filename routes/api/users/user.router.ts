import express, { Response, Request, NextFunction } from "express"
import prisma from "../../../prisma";
import * as userServices from "../users/user.services"
import { User } from "@prisma/client";
import passport from "../../../Utils/passport";

const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  try {
    const users = await userServices.findAllUsers();
    return res.status(200).json(users);
  } catch (e: any) {
    return res.status(500).send("Internal server error")
  }
})

userRouter.get("/me", passport.authenticate('jwt', { session: false }), async(req, res) => {
  try {
    return res.status(200).send("hello");
  } catch (error) {
    
  }
})
userRouter.post("/", async (req, res) => {
  try {
    const newUser: User = req.body;
    const result = await userServices.createUser(newUser);
    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).send("Internal server error")
  }

})
userRouter.post("/:id", (req, res) => {

})
userRouter.delete("/:id", (req, res) => {

})

export default userRouter;