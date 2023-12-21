import express, { Express, Request, Response , Application, NextFunction } from 'express';
import { authorizeDeleteAndPut } from './middleswares/authorizationMiddleware';
import api from './routes/api';
import views from './routes/views';
 import passport from "passport"
import cookieParser from 'cookie-parser';
import prisma from './prisma';
import path from 'path';


async function main() {

  const app: Application = express();
  const port = process.env.PORT || 3000;


  app.use(express.json())
  app.use(cookieParser())
  app.set("view engine", "ejs")
  app.set('views', path.join(__dirname, 'views'));
  app.use("/uploads/products", express.static("./uploads/products"));
  app.use(passport.initialize())
  app.use("/api", api)
  app.use("/views", views)

  // Middleware d'erreur global
  app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
  });

  app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
  });
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

