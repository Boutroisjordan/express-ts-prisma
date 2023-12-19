import express, {Response, Request, NextFunction} from "express"
import * as authServices from "./auth.services"

const authRouter =  express.Router();

authRouter.get("/:id", (req, res) => {

})
authRouter.post("/login", async (req, res) => {
  try{
    const {email, password} = req.body;
    const token = await authServices.login(email, password);
    if(!token) throw new Error();

    return res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ message: "Logged in successfully" });

  } catch(err: any) {
    return res.status(401).send("Bad credentials")
  }

})

authRouter.post("/:id", (req, res) => {

})
authRouter.delete("/:id", (req, res) => {

})

export default authRouter;