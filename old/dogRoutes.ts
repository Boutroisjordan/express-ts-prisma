import express, { Application, Request, Response } from "express";

const dogRoutes = express.Router()

dogRoutes.get('/', (req: Request, res: Response) => {
  res.send('Dogs');
});
dogRoutes.get('/:id', (req: Request, res: Response) => {
  res.send(`Dogs ${req.params.id}`);
});
// app.put('/', (req: Request, res: Response) => {
//   res.send('Welcome to Express & TypeScript Server');
// });
// app.post('/', (req: Request, res: Response) => {
//   res.send('Welcome to Express & TypeScript Server');
// });
// app.delete('/', (req: Request, res: Response) => {
//   res.send('Welcome to Express & TypeScript Server');
// });

export default dogRoutes;