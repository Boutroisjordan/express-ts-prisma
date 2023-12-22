import bcrypt from "bcrypt";
import prisma from "../../../prisma"
import { Role, User } from "@prisma/client";
import encryptPassword from "../../../Utils/encryptPassword";
import { UserDto } from "../../../dtos/user.dto";


export async function findAllUsers(): Promise<Array<User>> {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (e: any) {
    throw new Error("Error find users")
  }
}


export async function createUser(user: UserDto) {
  try {
    const alreadyExist = await prisma.user.findUnique({ where: { email: user.email } });

    if (alreadyExist != undefined) throw new Error("User email already taken");

    const hashedPassword = await encryptPassword(user.password);
    const newUser = await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
        role: user.role as Role
      },
    });

    return newUser;
  } catch (e: any) {
    throw new Error("Error Register Error")
  }

}


export async function updateUser(userId: number, updatedUser: UserDto): Promise<User> {
  try {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!existingUser) {
      throw new Error("User not found");
    }

    if (updatedUser.password) {
      const hashedPassword = await encryptPassword(updatedUser.password);
      updatedUser.password = hashedPassword;
    }

    const updatedUserRecord = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updatedUser,
      }
    });

    return updatedUserRecord;
  } catch (error) {
    throw new Error('Error updating user');
  }
}

export async function deleteUser(userId: number): Promise<User> {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    return deletedUser;
  } catch (error) {
    throw new Error('Error deleting user');
  }
}



