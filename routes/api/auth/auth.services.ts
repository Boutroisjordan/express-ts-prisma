import  bcrypt from "bcrypt";
import  prisma from "../../../prisma"
import jwt from "jsonwebtoken"
import { Role } from "@prisma/client";
import { UserDto, UserSignUpDto } from "../../../dtos/user.dto";
import encryptPassword from "../../../Utils/encryptPassword";

const SECRET:string = process.env.JWT_SECRET || 'mysecrettoken';

export async function login(email: string, password: string): Promise<Object> {

  try{
    const user = await prisma.user.findUnique({ where: { email: email } });

    if(!user) {
      throw new Error("No user found")
    } 

    const isValid = await bcrypt.compare(password, user?.password)
    if(!isValid) {
      throw new Error("Bad Credentials")
    } 
    const access_token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: "3 hours" })
    return access_token;
  } catch (err: any) {
    throw new Error("Bad Credentials")
  }
}

export async function signup(user: UserSignUpDto) {
  try {

    const hashedPassword = await encryptPassword(user.password);
    const newUser = await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
        role: Role.CLIENT
      },
    });

    return newUser;

  } catch (e: any) {
    console.log("errrreur: ", e)
    throw new Error("Error Register Error")
  }

}
