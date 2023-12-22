import { Role } from "@prisma/client"

export interface UserDto {
  username: string,
  email: string,
  role: Role
  password: string
}

export interface UserSignUpDto {
  username: string,
  email: string,
  password: string
}

