import express, { Express, Request, Response, Application, NextFunction } from 'express';
import api from './routes/api';
 import passport from "passport"
import cookieParser from 'cookie-parser';
import prisma from './prisma';
import path from 'path';
import fs from "fs"
import { initData } from './InitData';
import cors from "cors"
import { AlreadyTakenError } from './routes/errors/AlreadyTakenError';
import { NotFoundError } from './routes/errors/NotFoundError';
import { BadCrendentialsError } from './routes/errors/BadCredentialsError';
import { BadRequestError } from './routes/errors/BadRequestError';


async function main() {

  const app: Application = express();
  const port = process.env.PORT || 3000;



  //Créer le dossier 
  if (!fs.existsSync("./uploads/products")) {
    fs.mkdirSync("./uploads/products", { recursive: true });
  }


  app.use(cors({ origin: "*" }))
  app.use(express.json())
  app.use(cookieParser())
  app.use("/uploads/products", express.static("./uploads/products"));
  app.use(passport.initialize())
  app.use("/api", api)

  // Middleware d'erreur global
  app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err);
    if (err instanceof AlreadyTakenError) {
      res.status(409).json({ message: err.message });
      return;
    }
    if (err instanceof NotFoundError) {
      res.status(404).json({ message: err.message });
      return;
    }
    if (err instanceof BadCrendentialsError) {
      res.status(401).json({ message: err.message });
      return;
    }
    if (err instanceof BadRequestError) {
      res.status(400).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  });

  app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
  });

  app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
  });

  await initData();
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

