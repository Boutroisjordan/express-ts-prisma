import  bcrypt from "bcrypt";
import  prisma from "../../../prisma"
import jwt from "jsonwebtoken"

const SECRET:string = process.env.JWT_SECRET || 'mysecrettoken';

export async function login(email: string, password: string): Promise<Object> {
  let loginSucceed = false;
  try{
    const user = await prisma.user.findFirstOrThrow({where: {email: email}});

    if(!user) {
      throw new Error("Bad credentials")
    } 

    const isValid = await bcrypt.compare(password, user?.password)
    if(!isValid) {
      throw new Error("Bad Credentials")
    } 
    const access_token = jwt.sign({ id: user.id, username: user.username, email: user.email }, SECRET, { expiresIn: "3 hours" })
    return access_token;
  } catch(err: any) {
    loginSucceed = false;
    throw new Error("Bad Credentials")
  }
}
