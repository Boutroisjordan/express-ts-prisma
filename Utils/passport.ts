import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import cookieParser from "cookie-parser"
import express,{Request } from "express"

const prisma = new PrismaClient();

const cookieExtractor = (req: Request) => {
  let jwt = null 

  if (req && req.cookies) {
      jwt = req.cookies['token']
  }
  return jwt
}


const jwtOptions: StrategyOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET || 'mysecrettoken',
};

const strategy = new JwtStrategy(jwtOptions, async (payload: JwtPayload, done:any) => {
  try {

    console.log("payload log: ", payload.id, " sub: ")
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (user?.id) {

      return done(null, user);
    } else {

      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
});

passport.use(strategy)

export default passport;