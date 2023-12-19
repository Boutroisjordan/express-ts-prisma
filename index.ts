import express, { Express, Request, Response , Application, NextFunction } from 'express';
import { authorizeDeleteAndPut } from './middleswares/authorizationMiddleware';
import api from './routes/api';
 import passport from "passport"
import cookieParser from 'cookie-parser';

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use("/api", api)



app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
