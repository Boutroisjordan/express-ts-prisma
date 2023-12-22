// auth.middleware.ts
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { PrismaClient, User, Role } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'mysecrettoken',
};

const strategy = new JwtStrategy(jwtOptions, async (payload: JwtPayload, done: any) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: payload.id } });

    if (!user) {
      return done(null, false);
    }
    const role = payload.role as Role;
    user.role = role;

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

passport.use(strategy);

export const authenticateAndAuthorize = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: User) => {
      if (err || !user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }



      // Vérifie si le rôle de l'utilisateur est autorisé
      if (roles.includes(user.role)) {
        return next();
      }

      return res.status(403).json({ message: 'Forbidden' });
    })(req, res, next);
  };
};

// export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
//   passport.authenticate('jwt', { session: false }, (err: any, user: User) => {
//     if (err || !user) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     req.user = user;


//     return next();
//   })(req, res, next);
// };

// export const authorizeRoles = (roles: Role) => {
//   return (req: Request, res: Response, next: NextFunction) => {

//     if (!req.user) throw new Error();

//     const userRole: User = req.user.role;

//     if (roles.includes(userRole)) {
//       return next();
//     }

//     return res.status(403).json({ message: 'Forbidden' });
//   };
// };
