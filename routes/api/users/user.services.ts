import bcrypt from "bcrypt";
import prisma from "../../../prisma"
import { User } from "@prisma/client";
import encryptPassword from "../../../Utils/encryptPassword";


export async function findAllUsers(): Promise<Array<User>> {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (e: any) {
    throw new Error("Error find users")
  }
}


export async function createUser(user: User) {
  try {
    const { username, email, password } = user;
    
    const hashedPassword = await encryptPassword(password);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    return newUser;
    
    
  } catch (e: any) {
    throw new Error("Error Register Error")
  }
  
}


