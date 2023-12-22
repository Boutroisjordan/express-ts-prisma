import  bcrypt from "bcrypt";
import  prisma from "../../../prisma"
import jwt from "jsonwebtoken"
import { Role } from "@prisma/client";
import { UserDto, UserSignUpDto } from "../../../dtos/user.dto";
import encryptPassword from "../../../Utils/encryptPassword";
import { AlreadyTakenError } from "../../errors/AlreadyTakenError";
import { BadCrendentialsError } from "../../errors/BadCredentialsError";
import { NotFoundError } from "../../errors/NotFoundError";

const SECRET:string = process.env.JWT_SECRET || 'mysecrettoken';

export async function login(email: string, password: string): Promise<Object> {

  try{
    const user = await prisma.user.findUnique({ where: { email: email } });

    if(!user) {
      throw new NotFoundError("No user found")
    } 

    const isValid = await bcrypt.compare(password, user?.password)
    if(!isValid) {
      throw new BadCrendentialsError();
    } 
    const access_token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: "3 hours" })

    return access_token;
  } catch (err: any) {
    if (err instanceof BadCrendentialsError) throw new BadCrendentialsError();
    if (err instanceof NotFoundError) throw new NotFoundError('User')
    throw new Error(err.message)
  }
}

export async function signup(user: UserSignUpDto) {
  try {
    const alreadyExist = await prisma.user.findUnique({ where: { email: user.email } })

    if (alreadyExist) {
      throw new AlreadyTakenError("email");
    } 

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
    if (e instanceof AlreadyTakenError) throw new AlreadyTakenError('email')
    throw new Error(e);
  }

}
